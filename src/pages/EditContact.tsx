import {
  Button,
  H1,
  H2,
  Input,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproAppTheme,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  editContact,
  getAllContacts,
  getAllOrganizations,
  getAllUsers,
} from "../api/api";
import { Dropdown } from "../components/Dropdown";
import { useUser } from "../context/userContext";
import { ICurrentAndList } from "../types/currentAndList";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateContact } from "../types/pipedrive/pipedriveCreateContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";

export const EditContact = () => {
  const { client } = useDeskproAppClient();
  const { theme } = useDeskproAppTheme();
  const navigate = useNavigate();
  const deskproUser = useUser();
  const { contactId } = useParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<IPipedriveCreateContact>();

  const [contact, setContact] = useState<ICurrentAndList<IPipedriveContact>>({
    current: null,
    list: [],
  });
  const [organization, setOrganization] = useState<
    ICurrentAndList<IPipedriveOrganization>
  >({
    current: null,
    list: [],
  });

  const [user, setUser] = useState<ICurrentAndList<IPipedriveUser>>({
    current: null,
    list: [],
  });

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

      await Promise.all([
        (async () => {
          const contacts = await getAllContacts(client, deskproUser.orgName);

          setContact({ current: null, list: contacts.data ?? [] });
        })(),
        (async () => {
          const organizations = await getAllOrganizations(
            client,
            deskproUser.orgName
          );

          setOrganization({
            current: null,
            list: organizations.data ?? [],
          });
        })(),
        (async () => {
          const users = await getAllUsers(client, deskproUser.orgName);

          setUser({
            current: null,
            list: users.data ?? [],
          });
        })(),
      ]);
    },
    [deskproUser]
  );

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("pipedriveEditButton");
  });

  useDeskproAppEvents(
    {
      onElementEvent(id) {
        switch (id) {
          case "pipedriveHomeButton": {
            navigate("/redirect");
            break;
          }
        }
      },
    },
    [client, deskproUser]
  );

  const submitEditContact = async (values: IPipedriveCreateContact) => {
    if (!client || !deskproUser || !contact || !contactId) return;

    const pipedriveContact = {
      name: values.name,
      email: values.email,
      label: values.label,
      phone: values.phone,
      owner_id: user.current,
      org_id: organization.current,
    } as IPipedriveCreateContact;

    Object.keys(pipedriveContact).forEach((key) => {
      if (!pipedriveContact[key as keyof typeof pipedriveContact]) {
        delete pipedriveContact[key as keyof typeof pipedriveContact];
      }
    });

    const response = await editContact(
      client,
      deskproUser?.orgName,
      pipedriveContact,
      contactId
    );

    if (!response.success) {
      setError("submit", {
        message: "Error creating contact",
      });

      return;
    }

    navigate("/");
  };

  const themes = {
    stackStyles: {
      marginTop: "5px",
      color: theme.colors.grey80,
      width: "100%",
    },
  };

  return (
    <Stack>
      <form
        onSubmit={handleSubmit(submitEditContact)}
        style={{ width: "100%" }}
      >
        <Stack vertical gap={5}>
          <H1>Details</H1>
          <Stack vertical style={themes.stackStyles}>
            <H1>Name</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              type="title"
              {...register("name")}
            />
          </Stack>
          <Dropdown
            title="Organization"
            data={organization}
            setter={setOrganization}
            errors={errors}
            keyName="id"
            valueName="name"
          ></Dropdown>
          <Stack vertical style={themes.stackStyles}>
            <H1>Label</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              type="text"
              {...register("label")}
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Phone number</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              type="number"
              {...register("phone")}
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <H1>Email</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              type="email"
              {...register("email")}
            />
          </Stack>
          <Dropdown
            title="Owner"
            data={user}
            setter={setUser}
            errors={errors}
            keyName="id"
            valueName="name"
          ></Dropdown>
        </Stack>
        <Button
          type="submit"
          style={{ marginTop: "10px" }}
          text="Save"
        ></Button>
        {errors?.submit && (
          <Stack style={{ marginTop: "10px" }}>
            <H2>Error editing contact</H2>
          </Stack>
        )}
      </form>
    </Stack>
  );
};
