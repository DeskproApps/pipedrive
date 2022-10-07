import {
  Button,
  H1,
  Input,
  Stack,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { createContact } from "../api/api";
import { ICreateContact } from "../types/createContact";

export const AddContact = () => {
  const { client } = useDeskproAppClient();

  const postContact = async (event: React.FormEvent<HTMLFormElement>) => {
    if (!client) return;
    event;
    const pipedriveUser = {
      name: "",
      primary_email: "string",
      phone: "string",
      owner_id: "number",
      org_id: "number",
    } as ICreateContact; // use event.target.value to get the values from the form

    await createContact(client, pipedriveUser);
  };

  const css = {
    stackStyles: {
      marginTop: "5px",
      color: "#8B9293",
    },
  };

  return (
    <Stack>
      <Stack vertical gap={10}>
        <form onSubmit={(e) => postContact(e)}>
          <Stack style={css.stackStyles} vertical>
            <H1>Name</H1>
            <Input required variant="inline" placeholder="Name" type="text" />
          </Stack>
          <Stack vertical style={css.stackStyles}>
            <H1>Organization</H1>
            <Input variant="inline" placeholder="Name" type="text" />
          </Stack>
          <Stack vertical style={css.stackStyles}>
            <H1>Label</H1>
            <Input variant="inline" placeholder="Name" type="text" />
          </Stack>
          <Stack vertical style={css.stackStyles}>
            <H1>Phone number</H1>
            <Input variant="inline" placeholder="Name" type="text" />
          </Stack>
          <Stack vertical style={css.stackStyles}>
            <H1>Email</H1>
            <Input variant="inline" placeholder="Name" type="text" />
          </Stack>
          <Stack vertical style={css.stackStyles}>
            <H1>Owner</H1>
            <Input variant="inline" placeholder="Name" type="text" />
          </Stack>
          <Stack vertical style={css.stackStyles}>
            <H1>Job title</H1>
            <Input variant="inline" placeholder="Name" type="text" />
          </Stack>
          <Stack vertical style={css.stackStyles}>
            <H1>Visible to</H1>
            <Input variant="inline" placeholder="Name" type="text" />
          </Stack>
          <Button
            type="submit"
            style={{ marginTop: "10px" }}
            text="Submit"
          ></Button>
        </form>
      </Stack>
    </Stack>
  );
};
