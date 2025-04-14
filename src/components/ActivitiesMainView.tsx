import { Fragment } from "react";
import {
  Title,
  HorizontalDivider,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { PipedriveLogo } from "./PipedriveLogo";
import { IPipedriveActivity } from "../types/pipedrive/pipedriveActivity";
import { useState } from "react";
import { getActivities, getCurrentUser } from "../api/api";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { TwoColumn } from "./TwoColumn";
import { useUser } from "../context/userContext";
import { isLast } from "../utils";
import { format } from "../utils/date/format";

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

  useInitialisedDeskproAppClient(async (client) => {
    if (!contact.id) {
      return
    };

    try {
      // Get the authenticated user and check if they are authorized to view activities
      // activities assigned to other users. if they aren't, show them activities assigned to them.
      const user = await getCurrentUser(client, orgName)

      const activitiesReq = user?.data?.is_admin
        ? getActivities(client, orgName)
        : getActivities(client, orgName, { ownerId: user.data.id, limit: 1 })

      const activities = await activitiesReq

      if (!activities.success) {
        return
      };

      setActivities(activities.data?? [])
    } catch (error) {
      setActivities([]);
    }
  }, [contact]);

  return (
    <>
      <Title
        title={`Activities (${activities.length})`}
        onClick={() => navigate("/createactivity")}
      />
      {activities.map((activity, idx) => (
        <Fragment key={activity.id}>
          <Title
            title={activity.subject}
            // Pipedrive doesn't have a direct link you can navigate to so we send the user to the activities list
            link={`https://${deskproUser?.orgName}.pipedrive.com/activities/list/user/everyone?person_id=${activity.person_id}`}
            icon={<PipedriveLogo />}
          />
          <TwoColumn
            leftLabel="Type"
            leftText={activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
            rightLabel="Date"
            rightText={format(activity.due_date) || "-"}
          />
          <HorizontalDivider
            style={{
              margin: `0 ${isLast(activities, idx) ? "-8px" : "0"} 10px`,
            }}
          />
        </Fragment>
      ))}
    </>
  );
};
