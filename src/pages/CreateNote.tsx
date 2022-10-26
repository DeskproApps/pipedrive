import {
  Button,
  H2,
  Stack,
  TextArea,
  AttachmentTag,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";

import { faPlus, faFile } from "@fortawesome/free-solid-svg-icons";
import { LabelButton, LabelButtonFileInput } from "@deskpro/deskpro-ui";
import { createNote } from "../api/api";
import { useUser } from "../context/userContext";

export const CreateNote = () => {
  const deskproUser = useUser();
  const { client } = useDeskproAppClient();

  const [note, setNote] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const submitImage = (data: React.FormEvent<HTMLInputElement>) => {
    setImage(data.target.files[0] ?? null);
  };

  const submitNote = async () => {
    if (!client || !deskproUser?.orgName) return;

    await createNote(client, deskproUser.orgName, image, note);
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
          ></AttachmentTag>
        )}
        <LabelButton
          style={{ padding: "0px" }}
          icon={faPlus}
          text="Add"
          minimal
        >
          <LabelButtonFileInput onChange={(e) => submitImage(e)} />
        </LabelButton>
      </Stack>
      <Button text="Add" onClick={() => submitNote()}></Button>
    </Stack>
  );
};
