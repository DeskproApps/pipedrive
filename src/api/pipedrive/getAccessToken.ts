import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

export default async function getAccessToken(
    client: IDeskproClient,
    code: string,
    callbackUrl: string
) {
    try {
        const fetch = await proxyFetch(client)

        const body = new URLSearchParams()
        body.append('grant_type', 'authorization_code')
        body.append('code', code)
        body.append('redirect_uri', callbackUrl)
        body.append('client_id', "__client_id__")
        body.append('client_secret', "__client_secret__")

        const response = await fetch("https://oauth.pipedrive.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString()
        });

        if (!response.ok) {
            throw new Error("Failed to fetch access token");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Error fetching access token");
    }
}
