import { Button, Input, Stack, Label } from "@deskpro/deskpro-ui";
import {
  DateInput,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  createActivity,
  getActivityTypes,
  getAllContacts,
  getAllDeals,
  getAllOrganizations,
  getAllUsers,
} from "../api/api";
import { Dropdown } from "../components/Dropdown";
import { useUser } from "../context/userContext";
import { Container } from "../components/common";
import { IPipedriveActivityType } from "../types/pipedrive/pipedriveActivityTypes";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateActivity } from "../types/pipedrive/pipedriveCreateActivity";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import { msToTime } from "../utils/date";

export const CreateActivity = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<IPipedriveCreateActivity>();
  const deskproUser = useUser();

  const [type, contactId, dealId, orgId, userId] = watch([
    "type",
    "person_id",
    "deal_id",
    "org_id",
    "user_id",
  ]);

  const [activityTypes, setActivityTypes] = useState<IPipedriveActivityType[]>([]);
  const [contacts, setContacts] = useState<IPipedriveContact[]>([]);
  const [organizations, setOrganization] = useState<IPipedriveOrganization[]>([]);
  const [deals, setDeals] = useState<IPipedriveDeal[]>([]);
  const [users, setUsers] = useState<IPipedriveUser[]>([]);

  const postActivity = async (data: IPipedriveCreateActivity) => {
    if (!deskproUser || !client) return;

    const activityObj = {
      note: data.note,
      subject: data.subject,
      due_date: data.start_date.toISOString().split("T")[0],
      due_time: data?.start_date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: data.end_date
        ? msToTime(
            Math.abs(data.end_date.getTime() - data.start_date.getTime())
          )
        : 0,
      deal_id: dealId,
      person_id: contactId,
      org_id: orgId,
      user_id: userId,
      type: type,
    } as unknown as IPipedriveCreateActivity;

    const response = await createActivity(
      client,
      deskproUser?.orgName,
      activityObj
    );

    if (!response.success) {
      setError("submit", {
        message: "Error creating contact",
      });

      return;
    }

    navigate("/home");
  };

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Create Activity");

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

  useDeskproAppEvents(
    {
      onElementEvent(id) {
        switch (id) {
          case "pipedriveHomeButton": {
            navigate("/home");
            break;
          }
        }
      },
    },
    [client]
  );

  useEffect(() => {
    register("user_id", { required: true });
    register("type", { required: true });
  }, [register]);

  useInitialisedDeskproAppClient(async (client) => {
    if (!deskproUser) return;

    await Promise.all([
      (async () => {
        const activitiesTypes = await getActivityTypes(
          client,
          deskproUser.orgName
        );

        setActivityTypes(activitiesTypes.data ?? []);
      })(),
      (async () => {
        const contacts = await getAllContacts(client, deskproUser.orgName);

        setContacts(contacts.data ?? []);
      })(),
      (async () => {
        const orgs = await getAllOrganizations(client, deskproUser.orgName);

        setOrganization(orgs.data ?? []);
      })(),
      (async () => {
        const deals = await getAllDeals(client, deskproUser.orgName);

        setDeals(
          deals?.data?.map((deal) => ({ ...deal, name: deal.title })) ?? []
        );
      })(),
      (async () => {
        const users = await getAllUsers(client, deskproUser.orgName);

        setUsers(users.data ?? []);
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
  });

  return (
    <Container>
      <form onSubmit={handleSubmit(postActivity)}>
        <Dropdown
          data={activityTypes}
          onChange={(e) => setValue("type", e)}
          title="Activity type"
          error={!!errors?.subject}
          value={type}
          keyName="key_string"
          valueName="name"
          required
        />

        <Label label="Activity Subject" required style={{ marginBottom: 10 }}>
          <Input
            error={Boolean(errors?.subject)}
            variant="inline"
            placeholder="Enter value"
            type="title"
            {...register("subject", { required: true })}
          />
        </Label>

        <Label label="Start Date" style={{ marginBottom: 10 }}>
          <DateInput
            error={Boolean(errors.start_date)}
            {...register("start_date", { required: true })}
            onChange={(date: [Date]) => setValue("start_date", date[0])}
            required
          />
        </Label>

        <Label label="End Date" style={{ marginBottom: 10 }}>
          <DateInput
            {...register("end_date")}
            onChange={(date: [Date]) => setValue("end_date", date[0])}
          />
        </Label>

        <Dropdown
          data={contacts}
          onChange={(e) => setValue("person_id", e)}
          title="Linked Person"
          value={contactId}
          keyName="id"
          valueName="name"
        />

        <Dropdown
          title="Organization"
          data={organizations}
          onChange={(e) => setValue("org_id", e)}
          value={orgId}
          keyName="id"
          valueName="name"
        />

        <Dropdown
          data={deals}
          onChange={(e) => setValue("deal_id", e)}
          value={dealId}
          title="Linked Deal"
          keyName="id"
          valueName="title"
        />

        <Dropdown
          title="Owner"
          data={users}
          value={userId}
          onChange={(e) => setValue("user_id", e)}
          error={!!errors?.user_id}
          keyName="id"
          valueName="name"
          required
        />

        <Label label="Note" style={{ marginBottom: 10 }}>
          <Input
            error={Boolean(errors.note)}
            variant="inline"
            placeholder="Enter value"
            type="title"
            {...register("note")}
          />
        </Label>

        <Stack justify="space-between">
          <Button type="submit" text="Create"/>
          <Button type="button" intent="tertiary" text="Cancel" onClick={() => navigate(`/home`)}/>
        </Stack>
      </form>
    </Container>
  );
};
