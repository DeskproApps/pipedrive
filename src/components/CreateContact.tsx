/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  DivAsInput,
  Dropdown,
  DropdownTargetProps,
  H1,
  H2,
  Input,
  Label,
  Stack,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useForm, SubmitHandler } from "react-hook-form";

import { useMemo, useState } from "react";
import {
  faCheck,
  faExternalLinkAlt,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

import { createContact, getAllOrganizations, getAllUsers } from "../api/api";
import { ICreateContact } from "../types/createContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import { Status } from "../types/status";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

export const CreateContact = () => {
  const { client } = useDeskproAppClient();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<ICreateContact>();

  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState<IPipedriveOrganization[]>(
    []
  );
  const [users, setUsers] = useState<IPipedriveUser[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | Status | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | Status | null>(
    null
  );
  const deskproUser = useUser();

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;
      const orgs = await getAllOrganizations(client, deskproUser?.orgName);

      setOrganizations(orgs.data);

      const users = await getAllUsers(client, deskproUser.orgName);

      setUsers(users.data);
    },
    [deskproUser]
  );

  const postContact = async (values: ICreateContact) => {
    if (!client || !deskproUser) return;

    const pipedriveContact = {
      name: values.name,
      email: values.email,
      label: values.label,
      phone: values.phone,
      owner_id: selectedUser,
      org_id: selectedOrg,
    } as ICreateContact;

    const response = await createContact(
      client,
      deskproUser?.orgName,
      pipedriveContact
    );

    if (!response.success) {
      setError("submit", {
        message: "Error creating contact",
      });

      return;
    }

    navigate("/");
  };

  const orgOptions = useMemo(() => {
    return organizations.map((org) => ({
      key: org.name,
      label: <Label label={org.name}></Label>,
      value: org.id,
      type: "value" as const,
    }));
  }, [organizations]) as any;

  const userOptions = users.map(
    (user) => ({
      key: user.name,
      label: <Label label={user.name}></Label>,
      value: user.id.toString(),
      type: "value" as const,
    }),
    [users]
  ) as any;

  const themes = {
    stackStyles: {
      marginTop: "5px",
      color: "#8B9293",
      width: "100%",
    },
  };

  return (
    <Stack vertical gap={10}>
      <form onSubmit={handleSubmit(postContact)} style={{ width: "100%" }}>
        <Stack style={themes.stackStyles} vertical>
          <H1>Name</H1>
          <Input
            style={errors?.name && { borderColor: "red" }}
            variant="inline"
            placeholder="Enter value"
            type="text"
            {...register("name", {
              required: true,
            })}
          />
        </Stack>
        <Stack vertical style={themes.stackStyles}>
          <H1>Organization</H1>
          <Dropdown<Status, HTMLDivElement>
            placement="bottom-start"
            options={orgOptions}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            onSelectOption={(option) => {
              setSelectedOrg(option.value);
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
                rightIcon={faCaretDown}
                placeholder="Enter value"
                value={
                  orgOptions.find((e: any) => e.value === selectedOrg)?.key ||
                  ""
                }
              />
            )}
          </Dropdown>
        </Stack>
        <Stack vertical style={themes.stackStyles}>
          <H1>Label</H1>
          <Input
            variant="inline"
            placeholder="Enter value"
            type="text"
            {...register("label", { required: false })}
          />
        </Stack>
        <Stack vertical style={themes.stackStyles}>
          <H1>Phone number</H1>
          <Input
            variant="inline"
            placeholder="Enter value"
            type="number"
            {...register("phone", { required: false })}
          />
        </Stack>
        <Stack vertical style={themes.stackStyles}>
          <H1>Email</H1>
          <Input
            style={errors?.email && { borderColor: "red" }}
            variant="inline"
            placeholder="Enter value"
            type="email"
            {...register("email", { required: true })}
          />
        </Stack>
        <Stack vertical style={themes.stackStyles}>
          <H1>Owner</H1>
          <Dropdown<Status, HTMLDivElement>
            placement="bottom-start"
            options={userOptions}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            onSelectOption={(option) => {
              setSelectedUser(option.value);
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
                rightIcon={faCaretDown}
                value={
                  userOptions.find((e: any) => e.value === selectedUser)?.key ||
                  ""
                }
              />
            )}
          </Dropdown>
        </Stack>
        <Stack style={{ justifyContent: "space-between" }}>
          <Button
            type="submit"
            style={{ marginTop: "10px" }}
            text="Submit"
          ></Button>
          <Button
            style={{
              marginTop: "10px",
              backgroundColor: "white",
              color: "#1C3E55",
              border: "1px solid #D3D6D7",
            }}
            text="Cancel"
            onClick={() => navigate("/")}
          ></Button>
        </Stack>
        {errors?.submit && (
          <h2 style={{ marginTop: "10px" }}>Error creating contact</h2>
        )}
      </form>
    </Stack>
  );
};
