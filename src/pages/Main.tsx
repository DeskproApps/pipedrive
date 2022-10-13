import {
  H1,
  HorizontalDivider,
  IDeskproClient,
  Property,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getContactById,
  getContactByPrompt,
  getOrganizationsById,
} from "../api/api";
import { useUser } from "../context/userContext";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { DealsMainView } from "../components/DealsMainView";
import { ActivitiesMainView } from "../components/ActivitiesMainView";
import { NotesMainView } from "../components/NotesMainView";

export const Main = () => {
  const { client } = useDeskproAppClient();

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

    if (id) {
      const contact = await getContactById(client, id);

      if (!contact.success) {
        await client
          .getEntityAssociation(
            "linkedPipedriveContacts",
            deskproUser.ticket.id
          )
          .delete(id);

        navigate("/contacts");

        return;
      }

      setPipedriveContact(contact.data);

      return;
    }

    const pipedriveContactFromPrompt = await getContactByPrompt(
      client,
      deskproUser.primaryEmail
    );

    if (!pipedriveContactFromPrompt.success) {
      navigate("/contacts");

      return;
    }

    const pipedriveContact = await getContactById(
      client,
      pipedriveContactFromPrompt.data.items[0]?.item.id ?? null
    );

    if (!pipedriveContact.success) {
      navigate("/contacts");

      return;
    }

    await client
      .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
      .set(pipedriveContact.data.id.toString());

    setPipedriveContact(pipedriveContact.data);

    return;
  };

  const getPipedriveOrganization = async (client: IDeskproClient) => {
    if (!pipedriveContact) return;

    const pipedriveOrganization = await getOrganizationsById(
      client,
      pipedriveContact.org_id.value
    );

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
          title: "Unlink contact",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });
  });

  useDeskproAppEvents(
    {
      async onElementEvent(id) {
        switch (id) {
          case "pipedriveHomeButton": {
            navigate("/");

            break;
          }
          case "pipedriveMenuButton": {
            if (!client || !deskproUser) return;
            const id = (
              await client
                .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
                .list()
            )[0];

            await client
              .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
              .delete(id);
            navigate("/contacts");

            break;
          }
        }
      },
    },
    [client, deskproUser]
  );

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;

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
      <Stack vertical>
        <Stack>
          <H1>{pipedriveContact?.name}</H1>
        </Stack>
        <Stack
          style={{ marginTop: "10px", marginBottom: "10px", width: "100%" }}
          vertical
          gap={10}
        >
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
      </Stack>
      {organization?.name && (
        <H1 style={{ fontSize: "30px" }}>{organization?.name}</H1>
      )}
      {organization && (
        <Stack style={{ marginTop: "10px", width: "100%" }} vertical gap={10}>
          {organization.owner_name && (
            <Property title="Owner">{organization.owner_name}</Property>
          )}
          {organization.people_count && (
            <Property title="Employees">{organization.people_count}</Property>
          )}
          <HorizontalDivider
            style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px" }}
          />
        </Stack>
      )}
      {pipedriveContact && (
        <div style={{ width: "100%" }}>
          <DealsMainView
            userId={pipedriveContact?.owner_id.id}
            personId={pipedriveContact?.id}
          />
          <ActivitiesMainView
            userId={pipedriveContact?.owner_id.id}
            personId={pipedriveContact?.id}
          />
          <NotesMainView
            userId={pipedriveContact?.owner_id.id}
            personId={pipedriveContact?.id}
          />
        </div>
      )}
    </Stack>
  );
};
