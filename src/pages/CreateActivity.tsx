import {
  Button,
  H1,
  Input,
  Stack,
  useDeskproAppClient,
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
import { ICurrentAndList } from "../types/currentAndList";
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
  } = useForm<IPipedriveCreateActivity>();

  const deskproUser = useUser();
  const [activityType, setActivityType] = useState<
    ICurrentAndList<IPipedriveActivityType>
  >({
    current: null,
    list: [],
  });
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
  const [deal, setDeal] = useState<ICurrentAndList<IPipedriveDeal>>({
    current: null,
    list: [],
  });
  const [user, setUser] = useState<ICurrentAndList<IPipedriveUser>>({
    current: null,
    list: [],
  });
  const [duration, setDuration] = useState<
    ICurrentAndList<{ key: string; value: string }>
  >({
    current: null,
    list: [],
  });
  const [time, setTime] = useState<
    ICurrentAndList<{ key: string; value: string }>
  >({
    current: null,
    list: [],
  });

  const postActivity = async (data: IPipedriveCreateActivity) => {
    if (!deskproUser || !client) return;
    const activity = {
      ...data,
      due_time: time.current,
      duration: duration.current,
      deal_id: deal.current,
      person_id: contact.current,
      org_id: organization.current,
      user_id: user.current,
      type: activityType.current,
    } as unknown as IPipedriveCreateActivity;

    console.log(activity);

    const response = await createActivity(
      client,
      deskproUser?.orgName,
      activity
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
    client.setTitle("Home");

    client.deregisterElement("pipedriveLink");

    client.deregisterElement("pipedriveMenuButton");

    client.registerElement("pipedriveHomeButton", {
      type: "home_button",
    });
  });

  useInitialisedDeskproAppClient(async (client) => {
    if (!deskproUser) return;

    await Promise.all([
      (async () => {
        const activitiesTypes = await getActivityTypes(
          client,
          deskproUser.orgName
        );

        setActivityType({ ...activityType, list: activitiesTypes.data });
      })(),
      (async () => {
        const contacts = await getAllContacts(client, deskproUser.orgName);

        setContact({ ...contact, list: contacts.data });
      })(),
      (async () => {
        const orgs = await getAllOrganizations(client, deskproUser.orgName);

        setOrganization({ ...organization, list: orgs.data });
      })(),
      (async () => {
        const deals = await getAllDeals(client, deskproUser.orgName);

        setDeal({
          ...deal,
          list: deals.data.map((deal) => ({ ...deal, name: deal.title })),
        });
      })(),
      (async () => {
        const users = await getAllUsers(client, deskproUser.orgName);

        setUser({ ...user, list: users.data });
      })(),
    ]);
    const hoursEvery30Minutes = getHoursEvery30Minutes();

    setTime({
      ...time,
      list: hoursEvery30Minutes.map((e, i) => ({
        key: i.toString(),
        value: e,
      })),
    });

    setDuration({
      ...duration,
      list: hoursEvery30Minutes.map((e, i) => ({
        key: i.toString(),
        value: e,
      })),
    });
  });

  return (
    <form onSubmit={handleSubmit(postActivity)} style={{ width: "100%" }}>
      <Stack vertical gap={5}>
        <Dropdown<IPipedriveActivityType>
          data={activityType}
          setter={setActivityType}
          title="Activity type"
          errors={errors}
          keyName="id"
          valueName="name"
        ></Dropdown>
        <Stack
          vertical
          style={{ marginTop: "5px", color: "#8B9293", width: "100%" }}
        >
          <H1>Activity Subject</H1>
          <Input
            style={errors?.activity_subject && { borderColor: "red" }}
            variant="inline"
            placeholder="Enter value"
            type="title"
            {...register("subject", { required: true })}
          />
        </Stack>
        <Stack
          vertical
          style={{ marginTop: "5px", color: "#8B9293", width: "100%" }}
        >
          <H1>Date</H1>
          <Input
            style={errors?.due_date && { borderColor: "red" }}
            variant="inline"
            placeholder="Enter value"
            type="date"
            {...register("due_date", { required: true })}
          />
        </Stack>
        <Dropdown<{ key: string; value: string }>
          data={time}
          setter={setTime}
          title="Time"
          errors={errors}
          keyName="key"
          valueName="value"
        ></Dropdown>
        <Dropdown<{ key: string; value: string }>
          data={duration}
          setter={setDuration}
          title="Duration"
          errors={errors}
          keyName="key"
          valueName="value"
        ></Dropdown>
        <Dropdown<IPipedriveContact>
          data={contact}
          setter={setContact}
          title="Linked Person"
          errors={errors}
          keyName="id"
          valueName="name"
        ></Dropdown>
        <Dropdown<IPipedriveOrganization>
          data={organization}
          setter={setOrganization}
          title="Linked Organization"
          errors={errors}
          keyName="id"
          valueName="name"
        ></Dropdown>
        <Dropdown<IPipedriveDeal>
          data={deal}
          setter={setDeal}
          title="Linked Deal"
          errors={errors}
          keyName="id"
          valueName="title"
        ></Dropdown>
        <Dropdown<IPipedriveUser>
          data={user}
          setter={setUser}
          title="Assigned to"
          errors={errors}
          keyName="id"
          valueName="name"
        ></Dropdown>
        <Stack
          vertical
          style={{ marginTop: "5px", color: "#8B9293", width: "100%" }}
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
        <Button
          type="submit"
          style={{ marginTop: "10px" }}
          text="Create"
        ></Button>
      </Stack>
    </form>
  );
};
