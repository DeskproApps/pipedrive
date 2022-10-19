import {
  H1,
  HorizontalDivider,
  IDeskproClient,
  Stack,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { Property } from "../components/Property";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getContactByEmail,
  getContactById,
  getOrganizationsById,
} from "../api/api";
import { useUser } from "../context/userContext";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { DealsMainView } from "../components/DealsMainView";
import { ActivitiesMainView } from "../components/ActivitiesMainView";
import { NotesMainView } from "../components/NotesMainView";
import { LogoAndLinkButton } from "../components/LogoAndLinkButton";

export const Main = () => {
  const { client } = useDeskproAppClient();

  const [pipedriveContact, setPipedriveContact] =
    useState<IPipedriveContact | null>(null);
  const [organization, setOrganization] =
    useState<IPipedriveOrganization | null>(null);

  const navigate = useNavigate();

  const deskproUser = useUser();

  const getPipedriveContact = async (client: IDeskproClient) => {
    if (!deskproUser || !deskproUser.orgName) return;

    const id = (
      await client
        .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
        .list()
    )[0];

    if (id) {
      const contact = await getContactById(client, deskproUser.orgName, id);

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

    const contact = await getContactByEmail(
      client,
      deskproUser.orgName,
      deskproUser.primaryEmail
    );

    if (!contact) {
      navigate("/contacts");

      return;
    }

    setPipedriveContact(contact);

    return;
  };

  const getPipedriveOrganization = async (client: IDeskproClient) => {
    if (!pipedriveContact?.org_id || !deskproUser) return;

    const pipedriveOrganization = await getOrganizationsById(
      client,
      deskproUser.orgName,
      pipedriveContact.org_id.value
    );

    if (!pipedriveOrganization.success) return;

    setOrganization(pipedriveOrganization.data);
  };

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Home");

    client.deregisterElement("pipedriveLink");

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
            navigate("/redirect");
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
    <Stack vertical>
      <Stack vertical style={{ width: "100%" }}>
        {pipedriveContact?.name && (
          <Stack
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <H1>{pipedriveContact?.name}</H1>
            <LogoAndLinkButton endpoint={`person/${pipedriveContact?.id}`} />
          </Stack>
        )}
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
          {organization?.owner_name && (
            <Property title="Owner">{organization.owner_name}</Property>
          )}
          {organization?.name && (
            <Property title="Organization">{organization.name}</Property>
          )}
        </Stack>
      </Stack>
      <HorizontalDivider
        style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px" }}
      />
      {pipedriveContact && deskproUser && (
        <div style={{ width: "100%" }}>
          <DealsMainView
            contact={pipedriveContact}
            orgName={deskproUser?.orgName}
          />
          <ActivitiesMainView
            contact={pipedriveContact}
            orgName={deskproUser?.orgName}
          />
          <NotesMainView
            contact={pipedriveContact}
            orgName={deskproUser?.orgName}
          />
        </div>
      )}
    </Stack>
  );
};
