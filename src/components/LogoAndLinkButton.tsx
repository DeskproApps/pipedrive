import { Stack } from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

import { PipedriveLogo } from "./PipedriveLogo";
import { useUser } from "../context/userContext";

export const LogoAndLinkButton = ({ endpoint }: { endpoint: string }) => {
  const deskproUser = useUser();

  return (
    <Stack
      style={{
        backgroundColor: "#F3F5F7",
        borderRadius: "10px",
        padding: "2px 5px 2px 5px",
        marginLeft: "10px",
        cursor: "pointer",
      }}
      onClick={() =>
        window.open(`https://${deskproUser?.orgName}.pipedrive.com/${endpoint}`)
      }
    >
      <PipedriveLogo />
      <FontAwesomeIcon
        icon={faArrowUpRightFromSquare as unknown as {
          prefix: "fas";
          iconName: "mailchimp";
        }}
        style={{
          marginLeft: "10px",
          alignSelf: "center",
          width: "10px",
        }}
      ></FontAwesomeIcon>
    </Stack>
  );
};
