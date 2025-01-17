import { useState, useCallback } from "react";
import styled from "styled-components";
import { P1, TSpan, Stack, Button as ButtonUI, ButtonProps } from "@deskpro/deskpro-ui";
import { useDeskproAppEvents, useDeskproAppClient } from "@deskpro/app-sdk";
import { nbsp } from "../constants";
import { getCurrentUser } from "../api/api";
import type { FC } from "react";
import type { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import type { Settings } from "../types/settings";

export const Button: FC<ButtonProps> = styled(ButtonUI)`
  min-width: 72px;
  justify-content: center;
`;

const Invalid = styled(TSpan)`
  color: ${({ theme }) => theme.colors.red100};
`;

const VerifySettings: FC = () => {
    const { client } = useDeskproAppClient();
    const [settings, setSettings] = useState<Settings>({});
    const [currentUser, setCurrentUser] = useState<IPipedriveUser|null>(null);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const errorMessage = "Failed to connect to Pipedrive, settings seem to be invalid";

    const onVerifySettings = useCallback(() => {
        const { api_key, instance_domain } = settings ?? {};

        if (!client || !api_key || !instance_domain) {
            return;
        }

        setIsLoading(true);
        setError("");
        setCurrentUser(null);

        return getCurrentUser(client, undefined, settings)
            .then((user) => setCurrentUser(user.data))
            .catch(() => setError(errorMessage))
            .finally(() => setIsLoading(false));
    }, [client, settings]);

    useDeskproAppEvents({
        onAdminSettingsChange: setSettings,
    }, [client]);

    return (
        <Stack align="baseline">
            <Button
                text="Verify Settings"
                intent="secondary"
                onClick={onVerifySettings}
                loading={isLoading}
                disabled={!settings?.api_key || !settings?.instance_domain || isLoading}
            />
            {nbsp}
            {currentUser
                ? <P1>Verified as <TSpan type="p1">{`<${currentUser?.email || currentUser?.name}>`}</TSpan></P1>
                : <Invalid type="p1">{error}</Invalid>
            }
        </Stack>
    );
};

export { VerifySettings };
