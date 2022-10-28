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
import { useNavigate, useParams } from "react-router-dom";
import {
  editDeal,
  getAllContacts,
  getAllOrganizations,
  getAllPipelines,
  getAllUsers,
} from "../api/api";
import { Dropdown } from "../components/Dropdown";
import { useUser } from "../context/userContext";
import { ICurrentAndList } from "../types/currentAndList";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateDeal } from "../types/pipedrive/pipedriveCreateDeal";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedrivePipeline } from "../types/pipedrive/pipedrivePipeline";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";

export const EditDeal = () => {
  const { client } = useDeskproAppClient();
  const navigate = useNavigate();
  const deskproUser = useUser();
  const { theme } = useDeskproAppTheme();
  const { dealId } = useParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<IPipedriveCreateDeal>();

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
  const [pipeline, setPipeline] = useState<ICurrentAndList<IPipedrivePipeline>>(
    {
      current: null,
      list: [],
    }
  );
  const [user, setUser] = useState<ICurrentAndList<IPipedriveUser>>({
    current: null,
    list: [],
  });

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

      await Promise.all([
        (async () => {
          const contacts = await getAllContacts(client, deskproUser.orgName);

          setContact({ current: null, list: contacts.data ?? [] });
        })(),
        (async () => {
          const organizations = await getAllOrganizations(
            client,
            deskproUser.orgName
          );

          setOrganization({
            current: null,
            list: organizations.data ?? [],
          });
        })(),
        (async () => {
          const pipelines = await getAllPipelines(client, deskproUser.orgName);

          setPipeline({
            current: null,
            list: pipelines.data ?? [],
          });
        })(),
        (async () => {
          const users = await getAllUsers(client, deskproUser.orgName);

          setUser({
            current: null,
            list: users.data ?? [],
          });
        })(),
      ]);
    },
    [deskproUser]
  );

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("pipedriveEditButton");
  });

  useDeskproAppEvents(
    {
      async onElementEvent(id) {
        switch (id) {
          case "pipedriveHomeButton": {
            navigate("/redirect");
            break;
          }
        }
      },
    },
    [client, deskproUser]
  );

  const submitEditDeal = async (values: IPipedriveCreateDeal) => {
    if (!client || !deskproUser || !contact || !dealId) return;

    const pipedriveDeal = {
      title: values.title,
      value: values.value,
      org_id: organization.current,
      person_id: contact.current,
      user_id: user.current,
      expected_close_date: values.expected_close_date,
      pipeline_id: pipeline.current,
    } as IPipedriveCreateDeal;

    Object.keys(pipedriveDeal).forEach((key) => {
      if (!pipedriveDeal[key as keyof typeof pipedriveDeal]) {
        delete pipedriveDeal[key as keyof typeof pipedriveDeal];
      }
    });

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

  const themes = {
    stackStyles: {
      marginTop: "5px",
      color: theme.colors.grey80,
      width: "100%",
    },
  };

  return (
    <Stack>
      <form onSubmit={handleSubmit(submitEditDeal)} style={{ width: "100%" }}>
        <Stack vertical gap={5}>
          <H1>Details</H1>
          <Stack vertical style={themes.stackStyles}>
            <H1>Title</H1>
            <Input
              variant="inline"
              placeholder="Enter value"
              type="title"
              {...register("title")}
            />
          </Stack>
          <Stack vertical style={themes.stackStyles}>
            <Dropdown
              title="Contact Person"
              data={contact}
              setter={setContact}
              errors={errors}
              keyName="id"
              valueName="name"
            ></Dropdown>
            <Dropdown
              title="Organization"
              data={organization}
              setter={setOrganization}
              errors={errors}
              keyName="id"
              valueName="name"
            ></Dropdown>
            <Stack vertical style={themes.stackStyles}>
              <H1>Value</H1>
              <Input
                variant="inline"
                placeholder="Enter value"
                type="number"
                {...register("value")}
              />
            </Stack>
            <Dropdown
              title="Pipeline"
              data={pipeline}
              setter={setPipeline}
              errors={errors}
              keyName="id"
              valueName="name"
            ></Dropdown>
            <Stack vertical style={themes.stackStyles}>
              <H1>Excepted close date</H1>
              <Input
                variant="inline"
                placeholder="Enter value"
                type="date"
                {...register("expected_close_date")}
              />
            </Stack>
            <Dropdown
              title="Owner"
              data={user}
              setter={setUser}
              errors={errors}
              keyName="id"
              valueName="name"
            ></Dropdown>
          </Stack>
          <Button
            type="submit"
            style={{ marginTop: "10px" }}
            text="Create"
          ></Button>
          {errors?.submit && (
            <h2 style={{ marginTop: "10px" }}>Error editing contact</h2>
          )}
        </Stack>
      </form>
    </Stack>
  );
};
