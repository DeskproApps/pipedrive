import { AnyIcon, Button, Input, Label, Radio, Stack } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  HorizontalDivider,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { getContactByPrompt } from "../api/api";
import { useUser } from "../context/userContext";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { useDebounce } from "../utils";
import { useNavigate } from "react-router-dom";

export const FindContact = () => {
  const { client } = useDeskproAppClient();

  const navigate = useNavigate();

  const [selectedContact, setSelectedContact] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<IPipedriveContact[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue } = useDebounce(inputText, 300);
  const deskproUser = useUser();

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

      if (debouncedValue.length > 1) {
        setLoading(true);

        const pipedriveUsers = await getContactByPrompt(
          client,
          deskproUser?.orgName,
          inputText
        );

        if (!pipedriveUsers.success) {
          setContacts([]);

          setLoading(false);

          return;
        }

        setContacts(
          pipedriveUsers.data.items.map(
            (e: { item: IPipedriveContact }) => e.item
          )
        );

        setLoading(false);
      }
    },
    [debouncedValue]
  );

  const linkContact = async () => {
    if (!deskproUser || !selectedContact) return;

    const getEntityAssociationData = (await client
      ?.getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
      .list()) as string[];

    if (getEntityAssociationData.length > 0) {
      await client
        ?.getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
        .delete(getEntityAssociationData[0]);
    }

    await client
      ?.getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
      .set(selectedContact);
    navigate("/home");
  };

  return (
    <div style={{ width: "100%" }}>
      <Input
        onChange={(e : React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter account details"
        type="text"
        leftIcon={faMagnifyingGlass as AnyIcon}
      />
      <Stack vertical style={{ width: "100%" }}>
        <Stack vertical style={{ width: "100%", marginBottom: "5px" }}>
          <Button
            style={{ marginTop: "7px", marginBottom: "5px" }}
            text="Link Contact"
            onClick={() => linkContact()}
          />
          <HorizontalDivider style={{ margin: "0 -8px" }}/>
        </Stack>
        {loading ? (
          <LoadingSpinner/>
        ) : (
          contacts.map((contact, i) => (
            <div style={{ width: "100%" }} key={i}>
              <Stack style={{ justifyContent: "space-between" }}>
                <Stack vertical justify="start" key={i}>
                  <Radio
                    label={contact.name}
                    id={"option4"}
                    style={{ color: "#3A8DDE" }}
                    name={"sbtest"}
                    checked={selectedContact === contact.id.toString()}
                    onChange={() => setSelectedContact(contact.id.toString())}
                  />
                  <Label
                    style={{ marginLeft: "20px" }}
                    label={contact.primary_email}
                  />
                </Stack>
              </Stack>
              <HorizontalDivider
                style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px" }}
              />
            </div>
          ))
        )}
      </Stack>
    </div>
  );
};
