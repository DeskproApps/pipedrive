import {
  H1,
  HorizontalDivider,
  IDeskproClient,
  Property,
  Stack,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";

import {
  getContactById,
  getContactByPrompt,
  getOrganizationsById,
  getOrganizationsByUserId,
} from "../api/api";
import { useUser } from "../context/userContext";
import { IPipedriveContact } from "../types/pipedriveContact";
import { IPipedriveOrganization } from "../types/pipedriveOrganization";
import { DealsMainView } from "../components/DealsMainView";
import { ActivitiesMainView } from "../components/ActivitiesMainView";
import { NotesMainView } from "../components/NotesMainView";

export const Main = () => {
  const [pipedriveContact, setPipedriveContact] =
    useState<IPipedriveContact | null>(null);
  const [organization, setOrganization] =
    useState<IPipedriveOrganization | null>(null);

  const navigate = useNavigate();

  const deskproUser = useUser();

  const getPipedriveContact = async (client: IDeskproClient) => {
    if (!deskproUser) return;
    const id = (
      await client
        .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
        .list()
    )[0];

    if (!id) {
      const pipedriveContactFromPrompt = await getContactByPrompt(
        client,
        deskproUser.primaryEmail
      );
      if (pipedriveContactFromPrompt.success) {
        const pipedriveContact = await getContactById(
          client,
          pipedriveContactFromPrompt.data.items[0]?.item.id ?? null
        );

        if (!pipedriveContact.success) {
          navigate("/contacts");

          return;
        }

        setPipedriveContact(pipedriveContact.data);

        return;
      }
      navigate("/contacts");

      return;
    }

    const contact = await getContactById(client, id);

    if (!contact.success) {
      await client
        .getEntityAssociation("linkedPipedriveContacts", deskproUser.ticket.id)
        .delete(id);

      navigate("/contacts");

      return;
    }

    setPipedriveContact(contact.data);
  };

  const getPipedriveOrganization = async (client: IDeskproClient) => {
    if (!pipedriveContact) return;

    const id = (
      await getOrganizationsByUserId(client, pipedriveContact.owner_id.id)
    ).data[0].id;

    const pipedriveOrganization = await getOrganizationsById(client, id);

    if (!pipedriveOrganization.success) return;

    setOrganization(pipedriveOrganization.data);
  };

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Home");

    client.registerElement("pipedriveHomeButton", {
      type: "home_button",
    });
    client.registerElement("pipedriveRefreshButton", {
      type: "refresh_button",
    });
    client.registerElement("pipedriveMenuButton", {
      type: "menu",
      items: [
        {
          title: "Contacts",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });
  });

  useDeskproAppEvents({
    onElementEvent(id: string) {
      console.log(id);
      switch (id) {
        case "pipedriveHomeButton": {
          redirect("/");
        }
      }
    },
  });

  useInitialisedDeskproAppClient(
    async (client) => {
      await getPipedriveContact(client);
    },

    [deskproUser]
  );

  useInitialisedDeskproAppClient(
    async (client) => {
      await getPipedriveOrganization(client);
    },

    [pipedriveContact]
  );

  return (
    <Stack vertical style={{ marginBottom: "300px" }}>
      <Stack>
        <H1>{pipedriveContact?.name}</H1>
      </Stack>
      <Stack
        style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}
        vertical
        gap={10}
      >
        {pipedriveContact?.name && (
          <Property title="Name">{pipedriveContact.name}</Property>
        )}
        {pipedriveContact?.primary_email && (
          <Property title="Email">{pipedriveContact.primary_email}</Property>
        )}
        {pipedriveContact?.phone[0].value && (
          <Property title="Phone">{pipedriveContact.phone[0].value}</Property>
        )}
        <HorizontalDivider
          style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px" }}
        />
      </Stack>
      <H1 style={{ fontSize: "30px" }}>{organization?.name}</H1>
      <Stack style={{ marginTop: "10px", width: "100%" }} vertical gap={10}>
        {organization?.owner_name && (
          <Property title="Owner">{organization.owner_name}</Property>
        )}
        {organization?.people_count.toString() && (
          <Property title="Employees">{organization.people_count}</Property>
        )}
        <HorizontalDivider
          style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px" }}
        />
      </Stack>
      <DealsMainView />
      <ActivitiesMainView />
      <NotesMainView />
    </Stack>
  );
};
