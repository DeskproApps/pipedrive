import {
  H1,
  Input,
  Stack,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";

import { useForm } from "react-hook-form";
import {
  getActivityTypes,
  getAllContacts,
  getAllDeals,
  getAllOrganizations,
  getAllUsers,
  getDeals,
} from "../api/api";
import { Dropdown } from "../components/Dropdown";
import { useUser } from "../context/userContext";
import { ICurrentAndList } from "../types/currentAndList";
import { IPipedriveActivity } from "../types/pipedrive/pipedriveActivity";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateActivity } from "../types/pipedrive/pipedriveCreateActivity";
import { IPipedriveCreateDeal } from "../types/pipedrive/pipedriveCreateDeal";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";

export const CreateActivity = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<IPipedriveCreateDeal>();

  const deskproUser = useUser();
  const [activity, setActivity] = useState<ICurrentAndList<IPipedriveActivity>>(
    {
      current: null,
      list: [],
    }
  );
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

  const postActivity = async (data: IPipedriveCreateActivity) => {
    
  }

  useInitialisedDeskproAppClient(async (client) => {
    if (!deskproUser) return;

    await Promise.all([
      (async () => {
        const activitiesTypes = await getActivityTypes(
          client,
          deskproUser.orgName
        );

        setActivity({ ...activity, list: activitiesTypes.data });
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

        setDeal({ ...deal, list: deals.data });
      })(),
      async () => {
        const users = await getAllUsers(client, deskproUser.orgName);

        setUser({ ...user, list: users.data });
      },
    ]);
  });

  return (
    <Stack vertical>
      <Dropdown
        data={activity}
        setter={setActivity}
        title="Activity type"
        errors={errors}
      ></Dropdown>
      <Dropdown
        data={contact}
        setter={setContact}
        title="Linked Person"
        errors={errors}
      ></Dropdown>
      <Dropdown
        data={organization}
        setter={setOrganization}
        title="Linked Organization"
        errors={errors}
      ></Dropdown>
      <Dropdown
        data={user}
        setter={setUser}
        title="Assigned to"
        errors={errors}
      ></Dropdown>
      <Stack
        vertical
        style={{ marginTop: "5px", color: "#8B9293", width: "100%" }}
      >
        <H1>Date</H1>
        <Input
          style={errors?.expected_close_date && { borderColor: "red" }}
          variant="inline"
          placeholder="Enter value"
          type="date"
          {...register("expected_close_date", { required: true })}
        />
      </Stack>
    </Stack>
  );
};
