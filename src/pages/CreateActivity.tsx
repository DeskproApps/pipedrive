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
import { useState } from "react";
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
import { IPipedriveActivityType } from "../types/pipedrive/pipedriveActivityTypes";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateActivity } from "../types/pipedrive/pipedriveCreateActivity";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import { getHoursEvery30Minutes } from "../utils/utils";

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
  const { theme } = useDeskproAppTheme();
  const deskproUser = useUser();
  const [activity, contactId, dealId, orgId, userId, duration, time] = watch([
    "subject",
    "person_id",
    "deal_id",
    "org_id",
    "user_id",
    "duration",
    "due_time",
  ]);

  const [activityTypes, setActivityTypes] = useState<IPipedriveActivityType[]>(
    []
  );
  const [contacts, setContacts] = useState<IPipedriveContact[]>([]);
  const [organizations, setOrganization] = useState<IPipedriveOrganization[]>(
    []
  );
  const [deals, setDeals] = useState<IPipedriveDeal[]>([]);
  const [users, setUsers] = useState<IPipedriveUser[]>([]);
  const [durations, setDurations] = useState<{ key: string; value: string }[]>(
    []
  );
  const [timeList, setTimeList] = useState<{ key: string; value: string }[]>(
    []
  );

  const postActivity = async (data: IPipedriveCreateActivity) => {
    if (!deskproUser || !client) return;

    const activityObj = {
      ...data,
      due_time: timeList[Number(time)].value,
      duration: durations[Number(duration)].value,
      deal_id: dealId,
      person_id: contactId,
      org_id: orgId,
      user_id: userId,
      type: activity,
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

    navigate("/");
  };

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Create Activity");

    client.deregisterElement("pipedriveLink");

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
            navigate("/redirect");
            break;
          }
        }
      },
    },
    [client]
  );

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
          deals.data.map((deal) => ({ ...deal, name: deal.title })) ?? []
        );
      })(),
      (async () => {
        const users = await getAllUsers(client, deskproUser.orgName);

        setUsers(users.data ?? []);
      })(),
    ]);
    const hoursEvery30Minutes = getHoursEvery30Minutes();

    setTimeList(
      hoursEvery30Minutes.map((e, i) => ({
        key: i.toString(),
        value: e,
      }))
    );

    setDurations(
      hoursEvery30Minutes.map((e, i) => ({
        key: i.toString(),
        value: e,
      }))
    );
  });

  const themes = {
    stackStyles: {
      marginTop: "5px",
      color: theme.colors.grey80,
      width: "100%",
    },
  };

  return (
    <form onSubmit={handleSubmit(postActivity)} style={{ width: "100%" }}>
      <Stack vertical gap={5}>
        <Dropdown
          data={activityTypes}
          onChange={(e) => setValue("subject", e)}
          title="Activity type"
          error={!!errors?.subject}
          value={activity}
          keyName="id"
          valueName="name"
        ></Dropdown>
        <Stack vertical style={themes.stackStyles}>
          <H1>Activity Subject</H1>
          <Input
            error={Boolean(errors?.subject)}
            variant="inline"
            placeholder="Enter value"
            type="title"
            {...register("subject", { required: true })}
          />
        </Stack>
        <Stack vertical style={themes.stackStyles}>
          <H1>Due Date</H1>
          <Input
            style={{
              color: theme.colors.grey80,
            }}
            error={Boolean(errors?.due_date)}
            variant="inline"
            placeholder="Enter value"
            type="date"
            {...register("due_date", { required: true })}
          />
        </Stack>
        <Dropdown<{ key: string; value: string }>
          data={timeList}
          onChange={(e) => setValue("due_time", e)}
          title="Due Time"
          value={time}
          error={!!errors?.due_time}
          keyName="key"
          valueName="value"
        ></Dropdown>
        <Dropdown
          data={durations}
          onChange={(e) => setValue("duration", e)}
          title="Duration"
          value={duration}
          error={!!errors?.duration}
          keyName="key"
          valueName="value"
        ></Dropdown>
        <Dropdown
          data={contacts}
          onChange={(e) => setValue("person_id", e)}
          title="Linked Person"
          value={contactId}
          error={!!errors?.person_id}
          keyName="id"
          valueName="name"
        ></Dropdown>
        <Dropdown
          title="Organization"
          data={organizations}
          onChange={(e) => setValue("org_id", e)}
          value={orgId}
          error={!!errors?.org_id}
          keyName="id"
          valueName="name"
        />
        <Dropdown
          data={deals}
          onChange={(e) => setValue("deal_id", e)}
          value={dealId}
          title="Linked Deal"
          error={!!errors?.deal_id}
          keyName="id"
          valueName="title"
        ></Dropdown>
        <Dropdown
          title="Owner"
          data={users}
          value={userId}
          onChange={(e) => setValue("user_id", e)}
          error={!!errors?.user_id}
          keyName="id"
          valueName="name"
        />
        <Stack
          vertical
          style={{
            marginTop: "5px",
            color: theme.colors.grey80,
            width: "100%",
          }}
        >
          <H1>Note</H1>
          <Input
            style={errors?.note && { borderColor: "red" }}
            variant="inline"
            placeholder="Enter value"
            type="title"
            {...register("note", { required: true })}
          />
        </Stack>
        <Stack style={{ justifyContent: "space-between" }}>
          <Button
            type="submit"
            style={{ marginTop: "10px" }}
            text="Save"
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
      </Stack>
    </form>
  );
};
