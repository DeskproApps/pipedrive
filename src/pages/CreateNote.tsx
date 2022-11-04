import {
  Button,
  H2,
  Stack,
  TextArea,
  AttachmentTag,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
  useDeskproAppEvents,
} from "@deskpro/app-sdk";
import { useState } from "react";

import { faPlus, faFile } from "@fortawesome/free-solid-svg-icons";
import { LabelButton, LabelButtonFileInput } from "@deskpro/deskpro-ui";
import { createNote } from "../api/api";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

type TargetFile = {
  target: {
    files: File[];
  };
};

export const CreateNote = () => {
  const navigate = useNavigate();
  const deskproUser = useUser();
  const { client } = useDeskproAppClient();

  const [note, setNote] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
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

  const submitImage = (data: TargetFile) => {
    setImage(data.target.files[0] ?? null);
  };

  const submitNote = async () => {
    if (!client || !deskproUser?.orgName || !contactId || !note) return;

    await createNote(client, deskproUser.orgName, image, note, contactId);

    navigate("/");
  };

  return (
    <Stack vertical gap={10}>
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
      <H2>Attachments</H2>
      <Stack vertical style={{ width: "100%" }}>
        {image && (
          <AttachmentTag
            download
            filename={
              image.name.length > 19
                ? `${image.name.substring(0, 19)}...`
                : image.name
            }
            fileSize={image.size}
            icon={faFile}
            withClose
            onClose={() => setImage(null)}
          ></AttachmentTag>
        )}
        <LabelButton
          style={{ padding: "0px" }}
          icon={faPlus}
          text="Add"
          minimal
        >
          <LabelButtonFileInput
            accept="image/jpeg, image/jpg, image/pjp, image/pjpeg"
            onChange={(e) => submitImage(e as unknown as TargetFile)}
          />
        </LabelButton>
      </Stack>
      <Stack style={{ justifyContent: "space-between" }}>
        <Button
          onClick={() => submitNote()}
          style={{ marginTop: "10px" }}
          text="Save"
        ></Button>
        <Button
          style={{
            marginTop: "10px",
            backgroundColor: "white",
            color: "#1C3E55",
            border: "1px solid #D3D6D7",
          }}
          text="Cancel"
          onClick={() => navigate(`/redirect`)}
        ></Button>
      </Stack>
    </Stack>
  );
};
