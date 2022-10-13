import {
  H1,
  H2,
  HorizontalDivider,
  Stack,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { LogoAndLinkButton } from "./LogoAndLinkButton";
import { IPipedriveNote } from "../types/pipedriveNote";
import { useState } from "react";
import { getNotes } from "../api/api";

export const NotesMainView = ({
  userId,
  personId,
}: {
  userId: number;
  personId: number;
}) => {
  const [notes, setNotes] = useState<IPipedriveNote[]>([]);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!userId || !personId) return;

      const notesReq = await getNotes(client, personId);

      if (!notesReq.success) return;

      setNotes(notesReq.data.filter((e) => e.person_id === personId));
    },
    [userId, personId]
  );
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
        {notes.map((note, i) => {
          return (
            <Stack
              key={i}
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
                <H1>Note {++i}</H1>
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
