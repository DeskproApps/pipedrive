import { Stack } from "@deskpro/deskpro-ui";
import {
  HorizontalDivider,
  IDeskproClient,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  Title,
} from "@deskpro/app-sdk";
import { PipedriveLogo } from "../components/PipedriveLogo";
import { Property } from "../components/Property";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getContactByEmail,
  getContactById,
  getOrganizationsById,
} from "../api/api";
import { useUser } from "../context/userContext";
import { useAsyncError } from "../context/useAsyncError";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { DealsMainView } from "../components/DealsMainView";
import { ActivitiesMainView } from "../components/ActivitiesMainView";
import { NotesMainView } from "../components/NotesMainView";

export const Main = () => {
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();

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
      const contact = await getContactById(client, deskproUser.orgName, id)
          .catch(asyncErrorHandler);

      if (!contact?.success) {
        await client
          .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
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
    ).catch(asyncErrorHandler);

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
    ).catch(asyncErrorHandler);

    if (!pipedriveOrganization?.success) return;

    setOrganization(pipedriveOrganization.data);
  };

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Home");

    client.deregisterElement("pipedriveLink");

    client.registerElement("pipedriveEditButton", {
      type: "edit_button",
    });

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
      onElementEvent(id) {
        switch (id) {
          case "pipedriveHomeButton": {
            navigate("/redirect");
            break;
          }
          case "pipedriveEditButton": {
            if (!pipedriveContact) return;
            navigate(`/editcontact/${pipedriveContact.id}`);
            break;
          }
          case "pipedriveMenuButton": {
            if (!client || !deskproUser) return;

            (async () => {
              const id = (
                await client
                  .getEntityAssociation(
                    "linkedPipedriveContacts",
                    deskproUser.id
                  )
                  .list()
              )[0];

              await client
                .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
                .delete(id);
              navigate("/contacts");
            })();

            break;
          }
        }
      },
    },
    [client, deskproUser, pipedriveContact]
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
      <Stack vertical style={{ width: "100%" }} align="stretch">
        {pipedriveContact?.name && (
          <Title
            title={pipedriveContact.name}
            link={`https://${deskproUser?.orgName}.pipedrive.com/person/${pipedriveContact?.id}`}
            icon={<PipedriveLogo />}
          />
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
        style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px", marginBottom: 10 }}
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
