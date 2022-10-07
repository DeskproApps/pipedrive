import { Button, Stack, useDeskproAppClient } from "@deskpro/app-sdk";
import { useEffect, useState } from "react";

import { AddContact } from "../components/AddContact";
import { FindContact } from "../components/FindContact";
export const Contacts = () => {
  const { client } = useDeskproAppClient();
  const [currentPage, setcurrentPage] = useState("Find Contact");

  useEffect(() => {
    client?.setTitle(currentPage);

    client?.registerElement("pipedriveHomeButton", {
      type: "home_button",
      payload: {
        type: "changePage",
        page: "home",
      },
    });
    client?.registerElement("pipedriveRefreshButton", {
      type: "refresh_button",
    });
    client?.registerElement("pipedriveMenuButton", {
      type: "menu",
      items: [
        {
          title: "Add Contact",
          payload: {},
        },
      ],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const css = {
    buttonStyles: {
      padding: "10px",
      boxShadow: "none",
      WebkitBoxShadow: "none",
      fontWeight: "bold",
      border: "1px solid #D3D6D7",
      borderRadius: "5px",
    },
  };

  return (
    <Stack vertical gap={10}>
      <Stack
        style={{
          backgroundColor: "#EFF0F0",
          borderRadius: "5px",
          justifyContent: "space-between",
          alignContent: "center",
          padding: "3px",
          width: "100%",
        }}
      >
        <Button
          onClick={() => setcurrentPage("Find Contact")}
          text="Find Contact"
          icon="follow-up"
          intent="secondary"
          style={{
            ...css.buttonStyles,
            backgroundColor:
              currentPage === "Find Contact" ? "white" : "transparent",
            border:
              currentPage === "Find Contact" ? "1px solid #D3D6D7" : "none",
          }}
        />

        <Button
          onClick={() => setcurrentPage("Create Contact")}
          text="Create Contact"
          icon="follow-up"
          intent="secondary"
          style={{
            ...css.buttonStyles,
            backgroundColor:
              currentPage === "Create Contact" ? "white" : "transparent",
            border:
              currentPage === "Create Contact" ? "1px solid #D3D6D7" : "none",
          }}
        />
      </Stack>
      {currentPage === "Find Contact" ? <FindContact /> : <AddContact />}
    </Stack>
  );
};
