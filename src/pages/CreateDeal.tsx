/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  DivAsInput,
  Dropdown,
  DropdownTargetProps,
  H1,
  Input,
  Label,
  Stack,
  useDeskproAppClient,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import {
  faCheck,
  faExternalLinkAlt,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

import "../components/removeScrollInput.css";
import {
  getAllOrganizations,
  getAllContacts,
  getAllPipelines,
  getAllUsers,
  createDeal,
} from "../api/api";
import { Status } from "../types/status";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateDeal } from "../types/pipedrive/pipedriveCreateDeal";
import { IPipedrivePipeline } from "../types/pipedrive/pipedrivePipeline";
import { ICurrentAndList } from "../types/currentAndList";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";

export const CreateDeal = () => {
  const { client } = useDeskproAppClient();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm<IPipedriveCreateDeal>();

  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Home");

    client.deregisterElement("pipedriveLink");

    client.deregisterElement("pipedriveMenuButton");

    client.registerElement("pipedriveHomeButton", {
      type: "home_button",
    });
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

  const deskproUser = useUser();

  const checkErrors = (
    key:
      | "title"
      | "value"
      | "user_id"
      | "person_id"
      | "org_id"
      | "pipeline_id"
      | "expected_close_date"
      | "submit",
    value: Status | string | null
  ) => {
    if (!value) {
      setError(key, {
        type: "manual",
        message: `${key} is required`,
      });
      return false;
    }
  };

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

      const contacts = await getAllContacts(client, deskproUser.orgName);

      setContact({ current: null, list: contacts.data ?? [] });

      const organizations = await getAllOrganizations(
        client,
        deskproUser.orgName
      );

      setOrganization({ current: null, list: organizations.data ?? [] });

      const pipelines = await getAllPipelines(client, deskproUser.orgName);

      setPipeline({ current: null, list: pipelines.data ?? [] });

      const users = await getAllUsers(client, deskproUser.orgName);

      setUser({ current: null, list: users.data ?? [] });
    },
    [deskproUser]
  );

  const postDeal = async (values: IPipedriveCreateDeal) => {
    if (!client || !deskproUser || !contact) return;

    const errors = [
      checkErrors("person_id", contact.current),

      checkErrors("pipeline_id", pipeline.current),

      checkErrors("user_id", user.current),
    ];

    if (errors.includes(false)) return;

    const pipedriveDeal = {
      title: values.title,
      value: values.value,
      org_id: organization.current,
      person_id: contact.current,
      user_id: user.current,
      expected_close_date: values.expected_close_date,
      pipeline_id: pipeline.current,
    } as IPipedriveCreateDeal;

    const response = await createDeal(
      client,
      deskproUser?.orgName,
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

  const pipelineOptions = useMemo(() => {
    return pipeline.list.map((pipelineOption) => ({
      key: pipelineOption.name,
      label: <Label label={pipelineOption.name}></Label>,
      value: pipelineOption.id,
      type: "value" as const,
    }));
  }, [pipeline]) as any;

  const userOptions = useMemo(() => {
    return user.list.map((userOption) => ({
      key: userOption.name,
      label: <Label label={userOption.name}></Label>,
      value: userOption.id,
      type: "value" as const,
    }));
  }, [user]) as any;

  const contactOptions = useMemo(() => {
    return contact.list.map((contactOption) => ({
      key: contactOption.name,
      label: <Label label={contactOption.name}></Label>,
      value: contactOption.id,
      type: "value" as const,
    }));
  }, [contact]) as any;

  const organizationOptions = useMemo(() => {
    return organization.list.map((organizationOption) => ({
      key: organizationOption.name,
      label: <Label label={organizationOption.name}></Label>,
      value: organizationOption.id,
      type: "value" as const,
    }));
  }, [organization]) as any;

  const themes = {
    stackStyles: {
      marginTop: "5px",
      color: "#8B9293",
      width: "100%",
    },
  };

  return (
    <form onSubmit={handleSubmit(postDeal)} style={{ width: "100%" }}>
      <Stack vertical gap={5}>
        <H1 style={{}}>Details</H1>
        <Stack vertical style={themes.stackStyles}>
          <H1>Contact Person</H1>
          <Dropdown<Status, HTMLDivElement>
            placement="bottom-start"
            options={contactOptions}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            onSelectOption={(option) => {
              setContact({ ...contact, current: option.value });
            }}
          >
            {({
              targetProps,
              targetRef,
            }: DropdownTargetProps<HTMLDivElement>) => (
              <DivAsInput
                style={errors?.person_id && { borderColor: "red" }}
                ref={targetRef}
                {...targetProps}
                variant="inline"
                rightIcon={faCaretDown}
                placeholder="Enter value"
                value={
                  contactOptions.find((e: any) => e.value === contact.current)
                    ?.key ?? ""
                }
              />
            )}
          </Dropdown>
        </Stack>
        <Stack vertical style={themes.stackStyles}>
          <H1>Organization</H1>
          <Dropdown<Status, HTMLDivElement>
            placement="bottom-start"
            options={organizationOptions}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            onSelectOption={(option) => {
              setOrganization({ ...organization, current: option.value });
            }}
          >
            {({
              targetProps,
              targetRef,
            }: DropdownTargetProps<HTMLDivElement>) => (
              <DivAsInput
                style={errors?.org_id && { borderColor: "red" }}
                ref={targetRef}
                {...targetProps}
                variant="inline"
                rightIcon={faCaretDown}
                placeholder="Enter value"
                value={
                  organizationOptions.find(
                    (e: any) => e.value === organization.current
                  )?.key ?? ""
                }
              />
            )}
          </Dropdown>
        </Stack>
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
        <Stack vertical style={themes.stackStyles}>
          <H1>Pipeline</H1>
          <Dropdown<Status, HTMLDivElement>
            placement="bottom-start"
            options={pipelineOptions}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            onSelectOption={(option) => {
              setPipeline({ ...pipeline, current: option.value });
            }}
          >
            {({
              targetProps,
              targetRef,
            }: DropdownTargetProps<HTMLDivElement>) => (
              <DivAsInput
                style={errors?.pipeline_id && { borderColor: "red" }}
                ref={targetRef}
                {...targetProps}
                variant="inline"
                rightIcon={faCaretDown}
                placeholder="Enter value"
                value={
                  pipelineOptions.find((e: any) => e.value === pipeline.current)
                    ?.key ?? ""
                }
              />
            )}
          </Dropdown>
        </Stack>
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
        <Stack vertical style={themes.stackStyles}>
          <H1>Owner</H1>
          <Dropdown<Status, HTMLDivElement>
            placement="bottom-start"
            options={userOptions}
            fetchMoreText={"Fetch more"}
            autoscrollText={"Autoscroll"}
            selectedIcon={faCheck}
            externalLinkIcon={faExternalLinkAlt}
            onSelectOption={(option) => {
              setUser({ ...user, current: option.value });
            }}
          >
            {({
              targetProps,
              targetRef,
            }: DropdownTargetProps<HTMLDivElement>) => (
              <DivAsInput
                style={errors?.user_id && { borderColor: "red" }}
                ref={targetRef}
                {...targetProps}
                variant="inline"
                rightIcon={faCaretDown}
                placeholder="Enter value"
                value={
                  userOptions.find((e: any) => e.value === user.current)?.key ??
                  ""
                }
              />
            )}
          </Dropdown>
        </Stack>
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
