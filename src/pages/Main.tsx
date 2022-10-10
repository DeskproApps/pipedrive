import { H1, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getContactById } from "../api/api";
import { useUser } from "../context/userContext";
import { IPipedriveUser } from "../types/pipedriveUser";

export const Main = () => {
  const [pipedriveUser, setPipedriveUser] = useState<IPipedriveUser | null>(
    null
  );

  const navigate = useNavigate();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Home");

    client.registerElement("pipedriveHomeButton", {
      type: "home_button",
      payload: {
        type: "changePage",
        page: "/",
      },
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

  const deskproUser = useUser();

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;
      const id = await client
        .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
        .get<string>("id");

      if (!id) {
        navigate("/contacts");

        return;
      }

      const contact = await getContactById(client, id);

      if (!contact.success) {
        await client
          .getEntityAssociation(
            "linkedPipedriveContacts",
            deskproUser.ticket.id
          )
          .delete("id");

        navigate("/contacts");

        return;
      }

      setPipedriveUser(contact.data);

      if (!id) return;
    },
    [deskproUser]
  );

  return <H1>Home page with user data</H1>;
};
