import { Button, Input, Stack, Label } from "@deskpro/deskpro-ui";
import {
  useDeskproAppClient,
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
  const dpUser = useUser();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IPipedriveCreateContact>({
    defaultValues: {
      name: [dpUser?.firstName, dpUser?.lastName].filter(Boolean).join(" ") || "",
      email: dpUser?.primaryEmail || "",
    },
  });
  const navigate = useNavigate();
  const [orgId, ownerId] = watch(["org_id", "owner_id"]);
  const [organizations, setOrganizations] = useState<IPipedriveOrganization[]>([]);
  const [users, setUsers] = useState<IPipedriveUser[]>([]);
  const [error, setError] = useState<string|null>(null);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!dpUser) return;

      const orgs = await getAllOrganizations(client, dpUser?.orgName);
      setOrganizations(orgs.data ?? []);

      const users = await getAllUsers(client, dpUser.orgName);
      setUsers(users.data ?? []);
    },
    [dpUser]
  );

  const postContact = async (values: IPipedriveCreateContact) => {
    if (!client || !dpUser) return;

    const pipedriveContact = {
      name: values.name,
      email: values.email,
      label: values.label,
      phone: values.phone,
      owner_id: ownerId,
      org_id: orgId,
    } as IPipedriveCreateContact;

    setError(null);

    return createContact(client, dpUser?.orgName, pipedriveContact)
        .then((response) => client
            ?.getEntityAssociation("linkedPipedriveContacts", dpUser.id)
            .set(response.data.id.toString())
        )
        .then(() => navigate("/home"))
        .catch((err) => setError(err?.data?.error || "Error creating contact"));
  };

  return (
    <form onSubmit={handleSubmit(postContact)}>
      {error && <ErrorBlock text={error}/>}

      <Label label="Name" style={{ marginBottom: 10 }}>
        <Input
          style={errors?.name && {borderColor: "red"}}
          variant="inline"
          placeholder="Enter value"
          type="text"
          {...register("name", {
            required: true,
          })}
        />
      </Label>
      <Dropdown
        title="Organization"
        data={organizations}
        onChange={(e) => setValue("org_id", e)}
        value={orgId}
        error={!!errors?.org_id}
        keyName="id"
        valueName="name"
      />
      <Label label="Label" style={{ marginBottom: 10 }}>
        <Input
          variant="inline"
          placeholder="Enter value"
          type="text"
          {...register("label", {required: false})}
        />
      </Label>
      <Label label="Phone number" style={{ marginBottom: 10 }}>
        <Input
          variant="inline"
          placeholder="Enter value"
          type="number"
          {...register("phone", {required: false})}
        />
      </Label>
      <Label label="Email" style={{ marginBottom: 10 }}>
        <Input
          style={errors?.email && {borderColor: "red"}}
          variant="inline"
          placeholder="Enter value"
          type="email"
          {...register("email", {required: true})}
        />
      </Label>
      <Dropdown
        title="Owner"
        data={users}
        value={ownerId}
        onChange={(e) => setValue("owner_id", e)}
        error={!!errors?.owner_id}
        keyName="id"
        valueName="name"
      />

      <Stack justify="space-between">
        <Button
          type="submit"
          text="Submit"
        />
        <Button
          type="button"
          text="Cancel"
          intent="secondary"
          onClick={() => navigate("/home")}
        />
      </Stack>
    </form>
  );
};
