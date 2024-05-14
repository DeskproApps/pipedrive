import { Button, H2, Input, Stack, Label } from "@deskpro/deskpro-ui";
import {
  Title,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import "../components/removeScrollInput.css";

import {
  editDeal,
  getAllContacts,
  getAllOrganizations,
  getAllPipelines,
  getAllStages,
  getAllUsers,
  getDealById,
} from "../api/api";
import { Dropdown } from "../components/Dropdown";
import { useUser } from "../context/userContext";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateDeal } from "../types/pipedrive/pipedriveCreateDeal";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedrivePipeline } from "../types/pipedrive/pipedrivePipeline";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import { IPipedriveStage } from "../types/pipedrive/pipedriveStage";

export const EditDeal = () => {
  const { client } = useDeskproAppClient();
  const navigate = useNavigate();
  const deskproUser = useUser();
  const { dealId } = useParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    watch,
    setValue,
    reset,
  } = useForm<IPipedriveCreateDeal>();
  const [orgId, personId, pipelineId, userId, stageId] = watch([
    "org_id",
    "person_id",
    "pipeline_id",
    "user_id",
    "stage_id",
  ]);
  const [contacts, setContact] = useState<IPipedriveContact[]>([]);
  const [organizations, setOrganizations] = useState<IPipedriveOrganization[]>([]);
  const [pipelines, setPipelines] = useState<IPipedrivePipeline[]>([]);
  const [users, setUsers] = useState<IPipedriveUser[]>([]);
  const [stages, setStages] = useState<IPipedriveStage[]>([]);
  const [deal, setDeal] = useState<IPipedriveDeal | null>(null);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser || !dealId) return;

      await Promise.all([
        (async () => {
          const contacts = await getAllContacts(client, deskproUser.orgName);
          setContact(contacts.data ?? []);
        })(),
        (async () => {
          const organizations = await getAllOrganizations(
            client,
            deskproUser.orgName
          );
          setOrganizations(organizations.data ?? []);
        })(),
        (async () => {
          const pipelines = await getAllPipelines(client, deskproUser.orgName);
          setPipelines(pipelines.data ?? []);
        })(),
        (async () => {
          const users = await getAllUsers(client, deskproUser.orgName);
          setUsers(users.data ?? []);
        })(),
        (async () => {
          const deal = await getDealById(
            client,
            deskproUser.orgName,
            Number(dealId)
          );

          setDeal(deal.data);
        })(),
        (async () => {
          const stages = await getAllStages(client, deskproUser.orgName);
          setStages(stages.data ?? []);
        })(),
      ]);
    },
    [deskproUser]
  );

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Edit Deal");

    client.deregisterElement("pipedriveEditButton");
    client.deregisterElement("pipedriveMenuButton");
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

  useEffect(() => {
    if (!deal) return;

    reset({
      title: deal.title,
      value: deal.value.toString(),
      org_id: deal.org_id?.value.toString(),
      person_id: deal.person_id?.value?.toString(),
      pipeline_id: deal.pipeline_id.toString(),
      user_id: deal.user_id?.value?.toString(),
      stage_id: `${deal.stage_id}`,
    });
  }, [deal, reset]);

  const submitEditDeal = async (values: IPipedriveCreateDeal) => {
    if (!client || !deskproUser || !contacts || !dealId) return;

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

    const response = await editDeal(
      client,
      deskproUser?.orgName,
      pipedriveDeal,
      dealId
    );

    if (!response.success) {
      setError("submit", {
        message: "Error creating contact",
      });

      return;
    }

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(submitEditDeal)} style={{width: "100%"}}>
      <Title title="Details"/>

      <Label label="Title" style={{ marginBottom: 10 }}>
        <Input
          variant="inline"
          placeholder="Enter value"
          type="title"
          {...register("title")}
        />
      </Label>

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
      <Label label="Value">
        <Input
          variant="inline"
          placeholder="Enter value"
          type="number"
          {...register("value")}
        />
      </Label>
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
        valueName="name"
      />
      <Label label="Excepted close date" style={{ marginBottom: 10 }}>
        <Input
          variant="inline"
          placeholder="Enter value"
          type="date"
          {...register("expected_close_date")}
        />
      </Label>
      <Dropdown
        title="User"
        data={users}
        value={userId}
        onChange={(e) => setValue("user_id", e)}
        error={!!errors?.user_id}
        keyName="id"
        valueName="name"
      />

      <Stack justify="space-between">
        <Button type="submit" text="Save"/>
        <Button type="button" intent="secondary" text="Cancel" onClick={() => navigate(`/dealdetails/${dealId}`)}/>
      </Stack>

      {errors?.submit && (
        <Stack style={{marginTop: "10px"}}>
          <H2>Error editing contact</H2>
        </Stack>
      )}
    </form>
  );
};
