import {
  TwoButtonGroup,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { CreateContact } from "../components/CreateContact";
import { FindContact } from "../components/FindContact";
import { Container } from "../components/common";

export const Contacts = () => {
  const [currentPage, setcurrentPage] = useState("Find Contact");

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("pipedriveEditButton");
    client.deregisterElement("pipedriveMenuButton");
    client.setTitle(currentPage);
  });

  return (
    <Container>
      <TwoButtonGroup
        selected={currentPage === "Find Contact" ? "one" : "two"}
        oneIcon={faMagnifyingGlass}
        twoIcon={faPlus}
        oneLabel="Find Contact"
        twoLabel="Create Contact"
        oneOnClick={() => setcurrentPage("Find Contact")}
        twoOnClick={() => setcurrentPage("Create Contact")}
      />

      {currentPage === "Find Contact" ? <FindContact /> : <CreateContact />}
    </Container>
  );
};
