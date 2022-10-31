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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  editContact,
  getAllOrganizations,
  getAllUsers,
  getContactById,
} from "../api/api";
import { Dropdown } from "../components/Dropdown";
import { useUser } from "../context/userContext";
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
    setValue,
    watch,
    reset,
  } = useForm<IPipedriveCreateContact>();

  const [orgId, ownerId] = watch(["org_id", "owner_id"]);
  const [contact, setContact] = useState<IPipedriveContact | null>(null);
  const [organizations, setOrganizations] = useState<IPipedriveOrganization[]>(
    []
  );
  const [users, setUsers] = useState<IPipedriveUser[]>([]);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser || !contactId) return;

      await Promise.all([
        (async () => {
          const contactRes = await getContactById(
            client,
            deskproUser.orgName,
            contactId
          );

          setContact(contactRes.data);
        })(),
        (async () => {
          const organizations = await getAllOrganizations(
            client,
            deskproUser.orgName
          );

          setOrganizations(organizations.data ?? []);
        })(),
        (async () => {
          const users = await getAllUsers(client, deskproUser.orgName);

          setUsers(users.data ?? []);
        })(),
      ]);
    },
    [deskproUser]
  );

  useEffect(() => {
    if (!contact) return;

    reset({
      name: contact.name,
      email: contact.email[0].value,
      phone: contact.phone[0].value,
      owner_id: contact.owner_id?.value.toString(),
      org_id: contact.org_id?.value.toString(),
      label: contact.label ?? "",
    });
  }, [contact, reset]);

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
    [client]
  );

  const submitEditContact = async (values: IPipedriveCreateContact) => {
    if (!client || !deskproUser || !contactId) return;

    const pipedriveContact = {
      name: values.name,
      email: values.email,
      label: values.label,
      phone: values.phone,
      owner_id: ownerId,
      org_id: orgId,
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
            data={organizations}
            onChange={(e) => setValue("org_id", e)}
            value={orgId}
            error={!!errors?.org_id}
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
              type="tel"
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
            data={users}
            value={ownerId}
            onChange={(e) => setValue("owner_id", e)}
            error={!!errors?.owner_id}
            keyName="id"
            valueName="name"
          />
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
