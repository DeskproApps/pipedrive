import {
  HorizontalDivider,
  IDeskproClient,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  Title,
  Property,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { PipedriveLogo } from "../components/PipedriveLogo";
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
import { Container } from "../components/common";
import { Settings } from "@/types/settings";
import { useLogout } from "@/api/deskpro";

export const Main = () => {
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();

  const [pipedriveContact, setPipedriveContact] =
    useState<IPipedriveContact | null>(null);
  const [organization, setOrganization] =
    useState<IPipedriveOrganization | null>(null);

  const { context } = useDeskproLatestAppContext<unknown, Settings>()
  const isUsingOAuth = context?.settings.use_access_token !== true || context.settings.use_advanced_connect === false

  const navigate = useNavigate();
  const { logoutActiveUser } = useLogout()

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
          payload: { type: "unlink" },
        },

        ...(isUsingOAuth
          ? [
            {
              title: "Logout",
              payload: { type: "logout" },
            },
          ]
          : [])
      ],
    });
  });

  useDeskproAppEvents(
    {
      onElementEvent(id, _type, payload) {
        switch (id) {
          case "pipedriveHomeButton": {
            navigate("/home");
            break;
          }
          case "pipedriveEditButton": {
            if (!pipedriveContact) return;
            navigate(`/editcontact/${pipedriveContact.id}`);
            break;
          }
        }


        if (payload && typeof payload === 'object' && 'type' in payload) {

          switch (payload.type) {
            case "logout": {
              if (isUsingOAuth) {
                logoutActiveUser()
              }
              break;
            }
            case "unlink": {
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

              break
            }
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
    <Container>
      {pipedriveContact?.name && (
        <Title
          title={pipedriveContact.name}
          link={`https://${deskproUser?.orgName}.pipedrive.com/person/${pipedriveContact?.id}`}
          icon={<PipedriveLogo />}
        />
      )}
      {pipedriveContact?.primary_email && (
        <Property label="Email" text={pipedriveContact.primary_email} />
      )}
      {pipedriveContact?.phone[0].value && (
        <Property label="Phone" text={pipedriveContact.phone[0].value} />
      )}
      {organization?.owner_name && (
        <Property label="Owner" text={organization.owner_name} />
      )}
      {organization?.name && (
        <Property label="Organization" text={organization.name} />
      )}

      <HorizontalDivider style={{ margin: "0 -8px 10px" }} />

      {pipedriveContact && deskproUser && (
        <>
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
        </>
      )}
    </Container>
  );
};
