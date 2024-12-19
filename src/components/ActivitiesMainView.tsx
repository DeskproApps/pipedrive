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
import { getActivitiesByUserId } from "../api/api";
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
    <>
      <Title
        title={`Activities (${activities.length})`}
        onClick={() => navigate("/createactivity")}
      />
      {activities.map((activity, idx) => (
        <Fragment key={activity.id}>
          <Title
            title={activity.subject}
            link={`https://${deskproUser?.orgName}.pipedrive.com/activities/list/user/${contact.owner_id.id}`}
            icon={<PipedriveLogo/>}
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
