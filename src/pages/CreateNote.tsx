import { useState } from "react";
import { faPlus, faFile } from "@fortawesome/free-solid-svg-icons";
import {
  Label,
  Stack,
  Button,
  AnyIcon,
  TextArea,
  LabelButton,
  AttachmentTag,
  LabelButtonFileInput,
} from "@deskpro/deskpro-ui";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { createNote } from "../api/api";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/common";
import { MAX_READABILITY_NAME } from "../constants";

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
  const [contactId, setContactId] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);

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
    if (!client || !contactId || !note) return;

    await createNote(client, image, note, contactId);

    navigate("/");
  };

  return (
    <Container>
      <Label label="Note" style={{ marginBottom: 10 }}>
        <TextArea
          variant="inline"
          value={note}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
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

      <Label label="Attachments">
        {image && (
          <AttachmentTag
            download
            filename={
              image.name.length > MAX_READABILITY_NAME
                ? `${image.name.substring(0, 19)}...`
                : image.name
            }
            fileSize={image.size}
            icon={faFile as AnyIcon}
            withClose
            onClose={() => setImage(null)}
          ></AttachmentTag>
        )}
      </Label>

      <LabelButton
          style={{ padding: "0px" }}
          icon={faPlus as AnyIcon}
          text="Add"
          minimal
        >
        <LabelButtonFileInput
          accept="image/jpeg, image/jpg, image/pjp, image/pjpeg"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => submitImage(e as unknown as TargetFile)}
        />
      </LabelButton>

      <Stack justify="space-between">
        <Button text="Save" type="button" onClick={submitNote}/>
        <Button type="button" text="Cancel" intent="secondary" onClick={() => navigate(`/redirect`)}
        />
      </Stack>
    </Container>
  );
};
