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

  const deskproUser = useUser();

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!deskproUser) return;
      const id = (
        await client
          .getEntityAssociation("linkedPipedriveContacts", deskproUser.id)
          .list()
      )[0];

      if (!id) {
        navigate("/contacts");

        return;
      }

      const contact = await getContactById(client, id);

      if (!contact) {
        await client
          .getEntityAssociation(
            "linkedPipedriveContacts",
            deskproUser.ticket.id
          )
          .delete(id);

        navigate("/contacts");

        return;
      }

      setPipedriveUser(contact.data);

      if (!id) return;
    },
    [deskproUser]
  );

  return <H1>a{pipedriveUser}</H1>;
};
