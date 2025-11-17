import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Title, HorizontalDivider, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { getNotes } from "../api/api";
import { Comment } from "../components/Comment";
import type { IPipedriveNote } from "../types/pipedrive/pipedriveNote";
import type { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import "./image.css";

export const NotesMainView = ({
  contact,
}: {
  contact: IPipedriveContact;
}) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<IPipedriveNote[]>([]);

  useInitialisedDeskproAppClient(async (client) => {
    if (!contact.owner_id.id || !contact.id) {
      return;
    }

    const notesReq = await getNotes(client, contact.id);

    if (!notesReq.success) {
      return;
    }

    setNotes(notesReq?.data?.filter((e) => e.person_id === contact.id) ?? []);
  }, [contact]);

  return (
    <>
      <Title
        title={`Notes (${notes.length})`}
        onClick={() => navigate("/createnote")}
        marginBottom={0}
      />
      {notes.map((note) => (
        <Fragment key={note.id}>
          <Comment
            key={note.id}
            name={note.user.name.split(" ").slice(0, 2).join(" ")}
            date={new Date(note.add_time)}
            text={note.content}
          />
          <HorizontalDivider style={{ marginBottom: 10 }} />
        </Fragment>
      ))}
    </>
  );
};
