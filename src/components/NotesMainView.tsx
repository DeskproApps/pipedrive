import { H1, H2, HorizontalDivider, Stack } from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { LogoAndLinkButton } from "./LogoAndLinkButton";

const notes = [
  {
    title: "Wash catto",
    content:
      "Catto is dirty and needs to be washed or else his mother will get pissed",
  },
];

export const NotesMainView = () => {
  return (
    <Stack vertical style={{ width: "100%" }}>
      <Stack
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack gap={"2px"} style={{ alignItems: "center" }}>
          <h1 style={{ fontSize: "12px" }}>Notes ({notes.length})</h1>
          <FontAwesomeIcon
            icon={faPlus}
            style={{ width: "12px", marginLeft: "5px" }}
          ></FontAwesomeIcon>
        </Stack>
      </Stack>
      <Stack vertical style={{ width: "100%" }}>
        {notes.map((note) => {
          return (
            <Stack
              vertical
              gap={5}
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Stack
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <H1>{note.title}</H1>
                <LogoAndLinkButton></LogoAndLinkButton>
              </Stack>
              <Stack style={{ alignItems: "flex-start", marginTop: "10px" }}>
                <Stack
                  vertical
                  style={{
                    marginLeft: "5px",
                    alignItems: "center",
                  }}
                >
                  <img src="/notelogo.png" />
                  <H1>10 mos</H1>
                </Stack>
                <div style={{ maxWidth: "20ch", marginLeft: "10px" }}>
                  <H2>{note.content}</H2>
                </div>
              </Stack>
              <HorizontalDivider
                style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px" }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
