import { Button, Stack, TextArea, Label } from "@deskpro/deskpro-ui";
import {
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { createNote } from "../api/api";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/common";

export const CreateNote = () => {
  const navigate = useNavigate();
  const deskproUser = useUser();
  const { client } = useDeskproAppClient();

  const [note, setNote] = useState<string>("");
  const [contactId, setContactId] = useState<string | null>(null);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

      const id = (
        await client
          .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
          .list()
      )[0];

      setContactId(id);
    },
    [deskproUser]
  );

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Create Note");

    client.deregisterElement("pipedriveEditButton");
    client.deregisterElement("pipedriveMenuButton");
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "pipedriveHomeButton": {
          navigate("/redirect");
          break;
        }
      }
    },
  });

  const submitNote = async () => {
    if (!client || !deskproUser?.orgName || !contactId || !note) return;

    await createNote(client, deskproUser.orgName, null, note, contactId);

    navigate("/");
  };

  return (
    <Container>
      <Label label="Note" style={{ marginBottom: 10 }}>
        <TextArea
          variant="inline"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter text here..."
          style={{
            resize: "none",
            minHeight: "5em",
            maxHeight: "100%",
            height: "auto",
            width: "100%",
            overflow: "hidden",
          }}
        />
      </Label>

      <Stack justify="space-between">
        <Button text="Save" type="button" onClick={submitNote}/>
        <Button type="button" text="Cancel" intent="secondary" onClick={() => navigate(`/redirect`)}
        />
      </Stack>
    </Container>
  );
};
