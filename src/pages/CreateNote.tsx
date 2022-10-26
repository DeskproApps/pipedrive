import {
  Button,
  H2,
  Stack,
  TextArea,
  AttachmentTag,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
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
            filename={image.name}
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
            onChange={(e) => submitImage(e as unknown as TargetFile)}
          />
        </LabelButton>
      </Stack>
      <Button text="Add" onClick={() => submitNote()}></Button>
    </Stack>
  );
};
