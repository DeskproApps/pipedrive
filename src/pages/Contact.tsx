import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";

import { FindContact } from "../components/FindContact";
export const Contacts = () => {
  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Find Contact");
  });

  return <FindContact />;
};
