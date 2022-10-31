/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  H1,
  Input,
  Stack,
  useDeskproAppClient,
  useDeskproAppTheme,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  createDeal,
  getAllContacts,
  getAllOrganizations,
  getAllPipelines,
  getAllUsers,
} from "../api/api";
import { Dropdown } from "../components/Dropdown";
import "../components/removeScrollInput.css";
import { useUser } from "../context/userContext";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateDeal } from "../types/pipedrive/pipedriveCreateDeal";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedrivePipeline } from "../types/pipedrive/pipedrivePipeline";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";

export const CreateDeal = () => {
  const { client } = useDeskproAppClient();
  const { theme } = useDeskproAppTheme();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<IPipedriveCreateDeal>();

  const [orgId, personId, pipelineId, userId] = watch([
    "org_id",
    "person_id",
    "pipeline_id",
    "user_id",
  ]);

  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Home");

    client.deregisterElement("pipedriveLink");
    client.deregisterElement("pipedriveEditButton");
    client.deregisterElement("pipedriveMenuButton");

    client.registerElement("pipedriveHomeButton", {
      type: "home_button",
      payload: {
        type: "changePage",
        page: "/",
      },
    });
  });

  const [contacts, setContacts] = useState<IPipedriveContact[]>([]);
  const [organizations, setOrganizations] = useState<IPipedriveOrganization[]>(
    []
  );
  const [pipelines, setPipelines] = useState<IPipedrivePipeline[]>([]);
  const [users, setUsers] = useState<IPipedriveUser[]>([]);

  const deskproUser = useUser();

  useEffect(() => {
    register("org_id", { required: true });
    register("person_id", { required: true });
    register("pipeline_id", { required: true });
    register("user_id", { required: true });
  }, [register]);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

      const contactsRes = await getAllContacts(client, deskproUser.orgName);
      setContacts(contactsRes.data ?? []);

      const organizationsRes = await getAllOrganizations(
        client,
        deskproUser.orgName
      );
      setOrganizations(organizationsRes.data ?? []);

      const pipelinesRes = await getAllPipelines(client, deskproUser.orgName);
      setPipelines(pipelinesRes.data ?? []);

      const users = await getAllUsers(client, deskproUser.orgName);
      setUsers(users.data ?? []);
    },
    [deskproUser]
  );

  const postDeal = async (values: IPipedriveCreateDeal) => {
    if (!client || !deskproUser) return;

    const pipedriveDeal = {
      title: values.title,
      value: values.value,
      org_id: orgId,
      person_id: personId,
      user_id: userId,
      expected_close_date: values.expected_close_date,
      pipeline_id: pipelineId,
    } as IPipedriveCreateDeal;

    const response = await createDeal(
      client,
      deskproUser.orgName,
      pipedriveDeal
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
    <form onSubmit={handleSubmit(postDeal)} style={{ width: "100%" }}>
      <Stack vertical gap={5}>
        <H1>Details</H1>
        <Stack vertical style={themes.stackStyles}>
          <H1>Title</H1>
          <Input
            style={errors?.title && { borderColor: "red" }}
            variant="inline"
            placeholder="Enter value"
            type="title"
            {...register("title", { required: true })}
          />
        </Stack>
        <Dropdown
          title="Contact Person"
          data={contacts}
          value={personId}
          onChange={(e) => setValue("person_id", e)}
          error={!!errors?.person_id}
          keyName="id"
          valueName="name"
        />
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
          <H1>Value</H1>
          <Input
            style={errors?.value && { borderColor: "red" }}
            variant="inline"
            placeholder="Enter value"
            type="number"
            {...register("value", { required: true })}
          />
        </Stack>
        <Dropdown
          title="Pipeline"
          data={pipelines}
          value={pipelineId}
          onChange={(e) => setValue("pipeline_id", e)}
          error={!!errors?.pipeline_id}
          keyName="id"
          valueName="name"
        />
        <Stack vertical style={themes.stackStyles}>
          <H1>Excepted close date</H1>
          <Input
            style={errors?.expected_close_date && { borderColor: "red" }}
            variant="inline"
            placeholder="Enter value"
            type="date"
            {...register("expected_close_date", { required: true })}
          />
        </Stack>
        <Dropdown
          title="Owner"
          data={users}
          value={userId}
          onChange={(e) => setValue("user_id", e)}
          error={!!errors?.user_id}
          keyName="id"
          valueName="name"
        />
        <Button
          type="submit"
          style={{ marginTop: "10px" }}
          text="Create"
        ></Button>
        {errors?.submit && (
          <h2 style={{ marginTop: "10px" }}>Error creating contact</h2>
        )}
      </Stack>
    </form>
  );
};
