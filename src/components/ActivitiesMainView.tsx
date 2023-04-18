/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HorizontalDivider,
  Stack,
  useInitialisedDeskproAppClient,
  VerticalDivider,
} from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, IconName } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { LogoAndLinkButton } from "./LogoAndLinkButton";
import { IPipedriveActivity } from "../types/pipedrive/pipedriveActivity";
import { useState } from "react";
import { getActivitiesByUserId } from "../api/api";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { TwoColumn } from "./TwoColumn";

export const ActivitiesMainView = ({
  contact,
  orgName,
}: {
  contact: IPipedriveContact;
  orgName: string;
}) => {
  const navigate = useNavigate();

  const [activities, setActivities] = useState<IPipedriveActivity[]>([]);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!contact.owner_id.id || !contact.id) return;

      const activitiesReq = await getActivitiesByUserId(
        client,
        orgName,
        contact.owner_id.id
      );

      if (!activitiesReq.success) return;

      setActivities(
        activitiesReq?.data?.filter((e) => e.person_id === contact.id) ?? []
      );
    },
    [contact]
  );

  return (
    <Stack vertical style={{ width: "100%" }}>
      <Stack
        align="center"
        style={{
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Stack gap={"2px"} style={{ alignItems: "center" }}>
          <h1 style={{ alignSelf: "center", fontSize: "12px" }}>
            Activities ({activities.length})
          </h1>
          <FontAwesomeIcon
            icon={faPlus as unknown as {
              prefix: "fas";
              iconName: "mailchimp";
            }}
            style={{ width: "12px", marginLeft: "5px", cursor: "pointer" }}
            onClick={() => navigate("/createactivity")}
          ></FontAwesomeIcon>
        </Stack>
      </Stack>
      <Stack vertical style={{ width: "100%" }}>
        {activities.map((activity, i) => {
          const date = new Date(activity.due_date);

          return (
            <Stack key={i} vertical style={{ width: "100%", marginTop: "5px" }}>
              <Stack
                style={{
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <h1 style={{ fontSize: "12px" }}>{activity.subject}</h1>
                <LogoAndLinkButton
                  endpoint={`activities/list/user/${contact.owner_id.id}`}
                />
              </Stack>
              <TwoColumn
                leftLabel="Type"
                leftText={
                  activity.type.charAt(0).toUpperCase() + activity.type.slice(1)
                }
                rightLabel="Date"
                rightText={`${date.getUTCDate()} ${date
                  .toLocaleString("default", { month: "long" })
                  .slice(0, 3)}, ${date.getFullYear()}`}
              ></TwoColumn>
              <HorizontalDivider
                style={{ width: "110%", color: "#EFF0F0", marginLeft: "-10px" }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
