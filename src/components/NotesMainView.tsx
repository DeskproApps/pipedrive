import {
  H2,
  HorizontalDivider,
  Stack,
  Title,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Avatar } from "@deskpro/deskpro-ui";
import parse from "html-react-parser";
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
    <>
      <Title
        title={`Notes (${notes.length})`}
        onClick={() => navigate("/createnote")}
        marginBottom={0}
      />
      <Stack vertical style={{ width: "100%" }}>
        {notes.map((note, i) => {
          return (
            <Stack
              key={i}
              vertical
              gap={5}
              style={{ width: "100%", marginTop: "10px" }}
            >
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
                  />
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
    </>
  );
};
