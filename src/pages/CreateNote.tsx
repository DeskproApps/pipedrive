import {
  Button,
  Stack,
  TextArea,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { createNote } from "../api/api";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

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
    <>
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
      <Stack style={{ justifyContent: "space-between" }}>
        <Button
          onClick={() => submitNote()}
          style={{ marginTop: "10px" }}
          text="Save"
        />
        <Button
          style={{
            marginTop: "10px",
            backgroundColor: "white",
            color: "#1C3E55",
            border: "1px solid #D3D6D7",
          }}
          text="Cancel"
          onClick={() => navigate(`/redirect`)}
        />
      </Stack>
    </>
  );
};
