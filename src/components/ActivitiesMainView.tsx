import {
  HorizontalDivider,
  Stack,
  useInitialisedDeskproAppClient,
  Title,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { PipedriveLogo } from "./PipedriveLogo";
import { IPipedriveActivity } from "../types/pipedrive/pipedriveActivity";
import { useState } from "react";
import { getActivitiesByUserId } from "../api/api";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { TwoColumn } from "./TwoColumn";
import { useUser } from "../context/userContext";

export const ActivitiesMainView = ({
  contact,
  orgName,
}: {
  contact: IPipedriveContact;
  orgName: string;
}) => {
  const navigate = useNavigate();
    const deskproUser = useUser();

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
      <Title
        title={`Activities (${activities.length})`}
        onClick={() => navigate("/createactivity")}
      />
      <Stack vertical style={{ width: "100%" }}>
        {activities.map((activity, i) => {
          const date = new Date(activity.due_date);

          return (
            <Stack key={i} vertical style={{ width: "100%", marginTop: "5px" }}>
              <Stack vertical align="stretch" style={{ width: "100%" }}>
                <Title
                  title={activity.subject}
                  link={`https://${deskproUser?.orgName}.pipedrive.com/activities/list/user/${contact.owner_id.id}`}
                  icon={<PipedriveLogo/>}
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
