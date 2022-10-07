import {
  Button,
  Input,
  Stack,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";

import { getContactByPrompt } from "../api/api";
import { useUser } from "../context/userContext";
import { IPipedriveUser } from "../types/pipedriveUser";
import useDebounce from "../utils/debounce";

export const FindContact = () => {
  const { client } = useDeskproAppClient();

  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [contacts, setContacts] = useState<IPipedriveUser[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const debouncedText = useDebounce(inputText, 300);
  const deskproUser = useUser();

  useInitialisedDeskproAppClient(
    async (client) => {
      const pipedriveUsers = await getContactByPrompt(client, inputText);

      setContacts(pipedriveUsers.data.items);
    },
    [debouncedText]
  );

  const linkContact = (selectedContact: string) => {
    if (!deskproUser) return;

    client
      ?.getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
      .set(selectedContact);
  };

  return (
    <div style={{ width: "100%" }}>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter account details"
        type="text"
        leftIcon="follow-up"
      />
      <Stack>
        {contacts.map((contact, i) => (
          <Button key={i} onClick={() => linkContact(contact.id)}></Button>
        ))}
      </Stack>
      <div
        style={{
          marginTop: "10px",
          display: "block",
          borderBottom: "0.5px solid #D3D6D7",
          width: "130%",
          marginLeft: "-5%",
        }}
      ></div>
      <Button
        style={{ marginTop: "5px" }}
        text="Link Contact"
        onClick={() => linkContact}
      ></Button>
    </div>
  );
};
