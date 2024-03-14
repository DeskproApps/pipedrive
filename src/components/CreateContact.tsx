import { Button, H1, Input, Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppClient,
  useDeskproAppTheme,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ErrorBlock } from "./ErrorBlock";
import { Dropdown } from "./Dropdown";
import { createContact, getAllOrganizations, getAllUsers } from "../api/api";
import { IPipedriveCreateContact } from "../types/pipedrive/pipedriveCreateContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";

export const CreateContact = () => {
  const { client } = useDeskproAppClient();
  const { theme } = useDeskproAppTheme();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IPipedriveCreateContact>();
  const navigate = useNavigate();
  const [orgId, ownerId] = watch(["org_id", "owner_id"]);
  const [organizations, setOrganizations] = useState<IPipedriveOrganization[]>([]);
  const [users, setUsers] = useState<IPipedriveUser[]>([]);
  const [error, setError] = useState<string|null>(null);
  const deskproUser = useUser();

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

      const orgs = await getAllOrganizations(client, deskproUser?.orgName);
      setOrganizations(orgs.data ?? []);

      const users = await getAllUsers(client, deskproUser.orgName);
      setUsers(users.data ?? []);
    },
    [deskproUser]
  );

  const postContact = async (values: IPipedriveCreateContact) => {
    if (!client || !deskproUser) return;

    const pipedriveContact = {
      name: values.name,
      email: values.email,
      label: values.label,
      phone: values.phone,
      owner_id: ownerId,
      org_id: orgId,
    } as IPipedriveCreateContact;

    setError(null);

    return createContact(client, deskproUser?.orgName, pipedriveContact)
        .then((response) => client
            ?.getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
            .set(response.data.id.toString())
        )
        .then(() => navigate("/"))
        .catch((err) => setError(err?.data?.error || "Error creating contact"));
  };

  const themes = {
    stackStyles: {
      marginTop: "5px",
      color: theme.colors.grey80,
      width: "100%",
    },
  };

  return (
    <Stack vertical gap={10} align="stretch">
      {error && <ErrorBlock text={error}/>}

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
        <Dropdown
          title="Organization"
          data={organizations}
          onChange={(e) => setValue("org_id", e)}
          value={orgId}
          error={!!errors?.org_id}
          keyName="id"
          valueName="name"
        />
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
        <Dropdown
          title="Owner"
          data={users}
          value={ownerId}
          onChange={(e) => setValue("owner_id", e)}
          error={!!errors?.owner_id}
          keyName="id"
          valueName="name"
        />
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
      </form>
    </Stack>
  );
};
