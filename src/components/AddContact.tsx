/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  DivAsInput,
  Dropdown,
  DropdownItemType,
  DropdownTargetProps,
  DropdownValueType,
  H1,
  Input,
  Label,
  Stack,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

import { useMemo, useState } from "react";
import { faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import { getAllOrganizations, getAllUsers } from "../api/api";
import { ICreateContact } from "../types/createContact";
import { EventTarget } from "../types/eventTarget";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import { Status } from "../types/status";

export const AddContact = () => {
  const plans = {
    essential: {
      "1": "Owner & Followers",
      "2": "Entire company",
    },
    professional: {
      "1": "Owner only",
      "2": "Owner's visibility group",
      "3": "	Owner's visibility group and sub-groups",
      "4": "Entire company",
    },
  };
  const { client } = useDeskproAppClient();

  const [organizations, setOrganizations] = useState<IPipedriveOrganization[]>(
    []
  );
  const [users, setUsers] = useState<IPipedriveUser[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<Status | null>(null);
  const [selectedVisibility, setSelectedVisibility] = useState<number>(0);

  useInitialisedDeskproAppClient(async (client) => {
    const orgs = await getAllOrganizations(client);

    setOrganizations(orgs.data);

    const users = await getAllUsers(client);

    setUsers(users.data);
  }, []);

  const postContact = async (event: React.FormEvent<HTMLFormElement>) => {
    const targets = event.target as unknown as EventTarget<ICreateContact>;

    if (!client) return;

    const pipedriveContact = {
      name: targets.name.value,
      primary_email: targets.primary_email.value,
      phone: targets.phone.value,
      owner_id: "number",
      org_id: "number",
    } as ICreateContact; // use event.target.value to get the values from the form

    //await createContact(client, pipedriveUser);
  };

  const orgOptions = useMemo(() => {
    return organizations.map((org) => ({
      key: org.name,
      label: <Label label={org.name}></Label>,
      value: org.id,
      type: "value" as const,
    }));
  }, [organizations]);

  const userOptions = useMemo(() => {
    return users.map((user) => ({
      key: user.name,
      label: <Label label={user.name}></Label>,
      value: user.id,
      type: "value" as const,
    }));
  }, [users]);

  const themes = {
    stackStyles: {
      marginTop: "5px",
      color: "#8B9293",
    },
  };
  console.log(selectedOrg);
  return (
    <Stack>
      <Stack vertical gap={10}>
        <form onSubmit={postContact}>
          <Stack style={themes.stackStyles} vertical>
            <H1>Name</H1>
            <Input
              required
              variant="inline"
              name="name"
              placeholder="Enter value"
              type="text"
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Organization</H1>
            <Dropdown
              placement="bottom-start"
              options={orgOptions}
              fetchMoreText={"Fetch more"}
              autoscrollText={"Autoscroll"}
              selectedIcon={faCheck}
              externalLinkIcon={faExternalLinkAlt}
              onSelectOption={(option) => {
                setSelectedOrg(option);
              }}
            >
              {({
                targetProps,
                targetRef,
              }: DropdownTargetProps<HTMLDivElement>) => (
                <DivAsInput
                  ref={targetRef}
                  {...targetProps}
                  variant="inline"
                  placeholder="Enter value"
                  value={selectedOrg}
                />
              )}
            </Dropdown>
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Label</H1>
            <Input
              variant="inline"
              name="label"
              placeholder="Enter value"
              type="text"
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Phone number</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              name="phoner"
              type="number"
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Email</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              name="primary_email"
              type="email"
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Owner</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              name="owner"
              type="text"
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Job title</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              name="job_title"
              type="text"
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Visible to</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              name="visible_to"
              type="text"
            />
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
