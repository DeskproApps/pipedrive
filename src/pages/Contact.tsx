import { AppElementPayload, TwoButtonGroup, useDeskproAppEvents, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { Container } from "../components/common";
import { CreateContact } from "../components/CreateContact";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FindContact } from "../components/FindContact";
import { Settings } from "@/types/settings";
import { useLogout } from "@/api/deskpro";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Contacts = () => {
  const [currentPage, setcurrentPage] = useState("Find Contact");
  const { context } = useDeskproLatestAppContext<unknown, Settings>()
  const isUsingOAuth = context?.settings.use_access_token !== true

  const { logoutActiveUser } = useLogout()
  const navigate = useNavigate();

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("pipedriveHomeButton", { type: "home_button" })
    registerElement("pipedriveRefreshButton", { type: "refresh_button" })

    if (isUsingOAuth) {
      registerElement("pipedriveMenuButton", { type: "menu", items: [{ title: "Logout" }] })
    }
  }, [])

  useDeskproAppEvents({
    onElementEvent(id: string, _type: string, _payload?: AppElementPayload) {
      switch (id) {
        case "pipedriveHomeButton":
          navigate("/home");
          break;
        case "pipedriveMenuButton":
          if (isUsingOAuth) {
            logoutActiveUser()
          }
          break;
      }
    },
  })

  useInitialisedDeskproAppClient((client) => {
    client.setTitle(currentPage);
    client.deregisterElement("pipedriveEditButton")
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
