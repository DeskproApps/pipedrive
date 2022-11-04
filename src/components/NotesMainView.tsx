/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  H1,
  H2,
  HorizontalDivider,
  Stack,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Avatar } from "@deskpro/deskpro-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import { LogoAndLinkButton } from "./LogoAndLinkButton";
import { useState } from "react";

import { IPipedriveNote } from "../types/pipedrive/pipedriveNote";
import { getNotes } from "../api/api";
import { timeSince } from "../utils/utils";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { useNavigate } from "react-router-dom";
import "./image.css";

export const NotesMainView = ({
  contact,
  orgName,
}: {
  contact: IPipedriveContact;
  orgName: string;
}) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<IPipedriveNote[]>([]);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!contact.owner_id.id || !contact.id) return;

      const notesReq = await getNotes(client, orgName, contact.id);

      if (!notesReq.success) return;

      setNotes(notesReq?.data?.filter((e) => e.person_id === contact.id) ?? []);
    },
    [contact]
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
            style={{ width: "12px", marginLeft: "5px", cursor: "pointer" }}
            onClick={() => navigate("/createnote")}
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
                <LogoAndLinkButton endpoint={`person/${contact.id}`} />
              </Stack>
              <Stack style={{ alignItems: "flex-start", marginTop: "10px" }}>
                <Stack
                  vertical
                  gap={3}
                  style={{
                    marginLeft: "5px",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    size={22}
                    name={note.user.name.split(" ").slice(0, 2).join(" ")}
                  ></Avatar>
                  <H2>{timeSince(new Date(note.add_time)).slice(0, 5)}</H2>
                </Stack>
                <div style={{ maxWidth: "20ch", marginLeft: "10px" }}>
                  <H2>
                    {parse(note.content)}
                  </H2>
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
