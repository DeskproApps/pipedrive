/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  H1,
  Input,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
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
  getAllStages,
  getAllUsers,
} from "../api/api";
import { Dropdown } from "../components/Dropdown";
import "../components/removeScrollInput.css";
import { useUser } from "../context/userContext";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateDeal } from "../types/pipedrive/pipedriveCreateDeal";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedrivePipeline } from "../types/pipedrive/pipedrivePipeline";
import { IPipedriveStage } from "../types/pipedrive/pipedriveStage";
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

  const [orgId, personId, pipelineId, userId, stageId] = watch([
    "org_id",
    "person_id",
    "pipeline_id",
    "user_id",
    "stage_id",
  ]);

  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Create Deal");

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
  const [stages, setStages] = useState<IPipedriveStage[]>([]);

  const deskproUser = useUser();

  useEffect(() => {
    register("stage_id", { required: true });
    register("value", { required: true });
    register("person_id", { required: true });
    register("pipeline_id", { required: true });
  }, [register]);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

      Promise.all([
        (async () => {
          const contactsRes = await getAllContacts(client, deskproUser.orgName);

          setContacts(contactsRes.data ?? []);
        })(),
        (async () => {
          const organizationsRes = await getAllOrganizations(
            client,
            deskproUser.orgName
          );
          setOrganizations(organizationsRes.data ?? []);
        })(),
        (async () => {
          const pipelinesRes = await getAllPipelines(
            client,
            deskproUser.orgName
          );
          setPipelines(pipelinesRes.data ?? []);
        })(),
        (async () => {
          const users = await getAllUsers(client, deskproUser.orgName);

          setUsers(users.data ?? []);
        })(),
        (async () => {
          const stages = await getAllStages(client, deskproUser.orgName);

          setStages(stages.data ?? []);
        })(),
      ]);
      setValue(
        "person_id",
        (
          await client
            .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
            .list()
        )[0]
      );
    },
    [deskproUser]
  );

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
      stage_id: stageId,
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
      <Stack vertical>
        <H1>Details</H1>
        <Stack vertical style={themes.stackStyles}>
          <Stack>
            <H1>Title</H1>
            <Stack style={{ color: "red" }}>
              <H1>⠀*</H1>
            </Stack>
          </Stack>
          <Input
            error={Boolean(errors.title)}
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
          required
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
            error={Boolean(errors.value)}
            variant="inline"
            placeholder="Enter value"
            type="number"
            {...register("value", { required: true })}
          />
        </Stack>
        <Dropdown
          title="Stage"
          data={stages}
          value={stageId}
          onChange={(e) => setValue("stage_id", e)}
          error={!!errors?.stage_id}
          keyName="id"
          required
          valueName="name"
        />
        <Dropdown
          title="Pipeline"
          data={pipelines}
          value={pipelineId}
          onChange={(e) => setValue("pipeline_id", e)}
          error={!!errors?.pipeline_id}
          keyName="id"
          required
          valueName="name"
        />
        <Stack vertical style={themes.stackStyles}>
          <H1>Excepted close date</H1>
          <Input
            error={Boolean(errors.expected_close_date)}
            variant="inline"
            placeholder="Enter value"
            type="date"
            {...register("expected_close_date")}
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
      </Stack>
      <Stack style={{ justifyContent: "space-between" }}>
        <Button
          type="submit"
          style={{ marginTop: "10px" }}
          text="Create"
        ></Button>
        <Button
          style={{
            marginTop: "10px",
            backgroundColor: "white",
            color: "#1C3E55",
            border: "1px solid #D3D6D7",
          }}
          text="Cancel"
          onClick={() => navigate(`/redirect`)}
        ></Button>
      </Stack>
      {errors?.submit && (
        <h2 style={{ marginTop: "10px" }}>Error creating contact</h2>
      )}
    </form>
  );
};
