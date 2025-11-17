import {
  HorizontalDivider,
  IDeskproClient,
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  Title,
  Property,
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

export const Main = () => {
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();

  const [pipedriveContact, setPipedriveContact] =
    useState<IPipedriveContact | null>(null);
  const [organization, setOrganization] =
    useState<IPipedriveOrganization | null>(null);

  const navigate = useNavigate();

  const deskproUser = useUser();

  async function getPipedriveContact(client: IDeskproClient) {
    if (!deskproUser || !deskproUser.orgName) {
      return
    };

    // Retrieve the contacts linked to the user.
    const id = (
      await client
        .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
        .list()
    )[0];

    // If a linked contact was found, fetch & set the data for the contact, navigate to the link page if the fetch fails.
    if (id) {
      const contact = await getContactById(client, id)
        .catch(asyncErrorHandler);

      if (!contact?.success) {
        // Delete the contact's link.
        await client
          .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
          .delete(id);

        navigate("/contacts");

        return;
      }

      setPipedriveContact(contact.data);
      return;
    }


    // Attempt automatically linking the ticket user by checking if there's a contact with the ticket user's email and linking them.
    // Navigate to the link page if no contact is found.
    const contact = await getContactByEmail(
      client,
      deskproUser.primaryEmail
    ).catch(asyncErrorHandler);

    if (!contact) {
      navigate("/contacts");

      return;
    }

    // Link the contact.
    await client
      .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
      .set(contact.id.toString());


    setPipedriveContact(contact);

    return;
  };

  async function getPipedriveOrganization(client: IDeskproClient) {
    if (!pipedriveContact?.org_id || !deskproUser) {
      return
    };

    const pipedriveOrganization = await getOrganizationsById(
      client,
      pipedriveContact.org_id.value
    ).catch(asyncErrorHandler);

    if (!pipedriveOrganization?.success) {
      return
    };

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
            if (!pipedriveContact) {
              return
            }

            navigate(`/editcontact/${pipedriveContact.id}`);
            break;
          }
          case "pipedriveMenuButton": {
            if (!client || !deskproUser) {
              return
            }

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
      if (!deskproUser) {
        return
      };

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
          />
          <ActivitiesMainView
            contact={pipedriveContact}
          />
          <NotesMainView
            contact={pipedriveContact}
          />
        </>
      )}
    </Container>
  );
};
