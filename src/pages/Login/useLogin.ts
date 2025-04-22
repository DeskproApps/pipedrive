import { createSearchParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/api/api";
import { OAuth2AccessTokenPath, OAuth2RefreshTokenPath } from "@/constants/deskpro";
import { IOAuth2, OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Settings, TicketData } from "@/types/settings";
import { useCallback, useState } from "react";
import { useUser } from "@/context/userContext";
import getAccessToken from "@/api/pipedrive/getAccessToken";

interface UseLogin {
    onSignIn: () => void,
    authUrl: string | null,
    error: null | string,
    isLoading: boolean,
};

export default function useLogin(): UseLogin {
    const [authUrl, setAuthUrl] = useState<string | null>(null)
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isPolling, setIsPolling] = useState(false)
    const [oauth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null)

    const navigate = useNavigate()
    const deskproUser = useUser();

    const { context } = useDeskproLatestAppContext<TicketData, Settings>()

    const isUsingOAuth = context?.settings.use_access_token === true || context?.settings.use_advanced_connect === false

    useInitialisedDeskproAppClient(async (client) => {
        if (!deskproUser || !context?.settings) {
            // Make sure settings have loaded.
            return
        }

        // Ensure they aren't using access tokens
        if (!isUsingOAuth) {
            setError("Enable OAuth to access this page");
            return
        }

        const mode = context?.settings.use_advanced_connect === false ? 'global' : 'local';

        const clientId = context?.settings.client_id;
        if (mode === 'local' && (typeof clientId !== 'string' || clientId.trim() === "")) {
            // Local mode requires a clientId.
            setError("A client ID is required");
            return
        }

        // Start OAuth process depending on the authentication mode
        const oauth2Response = mode === "local" ?
            await client.startOauth2Local(
                ({ state, callbackUrl }) => {
                    return `https://oauth.pipedrive.com/oauth/authorize?${createSearchParams([
                        ["response_type", "code"],
                        ["client_id", clientId ?? ""],
                        ["state", state],
                        ["redirect_uri", callbackUrl]
                    ])}`
                },
                /\bcode=(?<code>[^&#]+)/,
                async (code: string): Promise<OAuth2Result> => {
                    // Extract the callback URL from the authorization URL
                    const url = new URL(oauth2Response.authorizationUrl);
                    const redirectUri = url.searchParams.get("redirect_uri");

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL");
                    }

                    const data = await getAccessToken(client, code, redirectUri);

                    return { data }
                }
            )
            // Global Proxy Service
            : await client.startOauth2Global("04d3430deaf75a01");

        setAuthUrl(oauth2Response.authorizationUrl)
        setOAuth2Context(oauth2Response)

    }, [setAuthUrl, context?.settings.use_advanced_connect, context?.settings.use_access_token])

    useInitialisedDeskproAppClient((client) => {
        if (!deskproUser || !oauth2Context) {
            return
        }

        const startPolling = async () => {
            try {
                const result = await oauth2Context.poll()

                await client.setUserState(OAuth2AccessTokenPath, result.data.access_token, { backend: true })

                if (result.data.refresh_token) {
                    await client.setUserState(OAuth2RefreshTokenPath, result.data.refresh_token, { backend: true })
                }

                // Ensure a friendly error message is always sent to the user in case authentication fails
                try {
                    const activeUser = await getCurrentUser(client, deskproUser?.orgName)
                    if (!activeUser) {
                        throw new Error()
                    }
                } catch (e) {
                    throw new Error("Error authenticating user")
                }

                const linkedContactIds = await client.getEntityAssociation("linkedPipedriveContacts", deskproUser.id).list()

                if (linkedContactIds.length < 1) {
                    navigate("/contacts")
                } else {
                    navigate("/home")
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setIsLoading(false)
                setIsPolling(false)
            }
        }

        if (isPolling) {
            void startPolling()
        }
    }, [isPolling, deskproUser, oauth2Context, navigate])

    const onSignIn = useCallback(() => {
        setIsLoading(true);
        setIsPolling(true);
        window.open(authUrl ?? "", '_blank');
    }, [setIsLoading, authUrl]);

    return { authUrl, onSignIn, error, isLoading }

}