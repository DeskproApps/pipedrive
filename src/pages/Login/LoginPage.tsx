import { AnchorButton, H3, Stack } from "@deskpro/deskpro-ui"
import { ErrorBlock } from "@/components/ErrorBlock"
import { FC } from "react"
import { useDeskproElements } from "@deskpro/app-sdk"
import useLogin from "./useLogin"

const LoginPage: FC = () => {
    useDeskproElements(({ registerElement, clearElements }) => {
        clearElements()
        registerElement("refresh", { type: "refresh_button" })
    })

    const { onSignIn, authUrl, isLoading, error } = useLogin();

    return (
        <Stack padding={12} vertical gap={12} role="alert">
            <H3>Log into your Pipedrive account.</H3>
            <AnchorButton
                disabled={!authUrl || isLoading}
                href={authUrl || "#"}
                loading={isLoading}
                onClick={onSignIn}
                target={"_blank"}
                text={"Log In"}
            />

            {error && <ErrorBlock text={error}/>}
        </Stack>
    )
}

export default LoginPage