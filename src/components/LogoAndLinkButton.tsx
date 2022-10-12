import { Stack } from "@deskpro/app-sdk";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export const LogoAndLinkButton = () => {
  return (
    <Stack
      style={{
        backgroundColor: "#F3F5F7",
        borderRadius: "10px",
        padding: "5px",
        marginLeft: "10px",
      }}
    >
      <img
        src="../../icon.svg"
        style={{ width: "16px", alignSelf: "center" }}
        alt=""
      />
      <FontAwesomeIcon
        icon={faArrowUpRightFromSquare}
        style={{ marginLeft: "10px", alignSelf: "center" }}
      ></FontAwesomeIcon>
    </Stack>
  );
};
