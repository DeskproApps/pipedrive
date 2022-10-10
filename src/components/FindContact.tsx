import {
  Button,
  Input,
  Label,
  Radio,
  Spinner,
  Stack,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

import { getContactByPrompt } from "../api/api";
import { useUser } from "../context/userContext";
import { IPipedriveUser } from "../types/pipedriveUser";
import useDebounce from "../utils/debounce";

export const FindContact = () => {
  const { client } = useDeskproAppClient();

  const [selectedContact, setSelectedContact] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<IPipedriveUser[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue } = useDebounce(inputText, 300);
  const deskproUser = useUser();

  useInitialisedDeskproAppClient(
    async (client) => {
      if (debouncedValue.length > 1) {
        setLoading(true);
        const pipedriveUsers = await getContactByPrompt(client, inputText);

        setContacts(
          pipedriveUsers.data.items.map((e: { item: IPipedriveUser }) => e.item)
        );
        setLoading(false);
      }
    },
    [debouncedValue]
  );

  const linkContact = async () => {
    if (!deskproUser || !selectedContact) return;

    await client
      ?.getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
      .set("id", selectedContact);
  };

  return (
    <div style={{ width: "100%" }}>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter account details"
        type="text"
        leftIcon={faMagnifyingGlass}
      />
      <Stack vertical style={{ marginTop: "5px" }}>
        <Stack vertical style={{ width: "100%", marginBottom: "10px" }}>
          <Button
            style={{ marginTop: "5px" }}
            text="Link Contact"
            onClick={() => linkContact()}
          ></Button>
          <div
            style={{
              marginTop: "10px",
              display: "block",
              borderBottom: "0.5px solid #D3D6D7",
              width: "130%",
              marginLeft: "-5%",
            }}
          ></div>
        </Stack>
        {loading ? (
          <Spinner size="extra-large" />
        ) : (
          contacts.map((contact, i) => (
            <div style={{ width: "100%" }} key={i}>
              <Stack>
                <Stack vertical justify="start" key={i}>
                  <Radio
                    label={contact.name}
                    id={"option4"}
                    style={{ color: "#3A8DDE" }}
                    name={"sbtest"}
                    checked={selectedContact === contact.id}
                    onChange={() => setSelectedContact(contact.id)}
                  />
                  <Label
                    style={{ marginLeft: "20px" }}
                    label={contact.primary_email}
                  ></Label>
                </Stack>
                <Stack
                  style={{
                    backgroundColor: "#EFF0F0",
                    borderRadius: "10px",
                    padding: "5px",
                    alignSelf: "flex-end",
                    marginLeft: "10px",
                  }}
                >
                  <img
                    src="../../icon.svg"
                    style={{ width: "16px", alignSelf: "center" }}
                    alt=""
                  />
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    style={{ marginLeft: "10px", alignSelf: "center" }}
                  ></FontAwesomeIcon>
                </Stack>
              </Stack>
              <div
                style={{
                  marginTop: "5px",
                  display: "block",
                  borderBottom: "0.5px solid #D3D6D7",
                  width: "105%",
                  marginBottom: "5px",
                }}
              ></div>
            </div>
          ))
        )}
      </Stack>
    </div>
  );
};
