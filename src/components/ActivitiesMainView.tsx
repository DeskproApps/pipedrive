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
import { getAllContactActivities } from "../api/api";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { TwoColumn } from "./TwoColumn";
import { useUser } from "../context/userContext";
import { isLast } from "../utils";
import { format } from "../utils/date/format";
import { Spinner, Stack } from "@deskpro/deskpro-ui";

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
  const [isFetchingActivities, setIsFetchingActivities] = useState<boolean>(true);

  useInitialisedDeskproAppClient(async (client) => {
    if (!contact.id) {
      return
    };
    setIsFetchingActivities(true)

    try {
      const activitiesReq = await getAllContactActivities(client, orgName, contact.id)

      if (!activitiesReq.success) {
        return
      };

      // Filter out deleted activities.
      const activeActivities = activitiesReq.data.filter((activity)=> activity.is_deleted !== true)

      setActivities(activeActivities)
    } catch (error) {
      setActivities([]);
    } finally {
      setIsFetchingActivities(false)
    }
  }, [contact]);

  if (isFetchingActivities) {
    return (
      <>
        <Title
          title={`Activities`}
        />

        <Stack justify="center" align="center" style={{ height: "100px" }}>
          <Spinner size="large" />
        </Stack>
      </>
    )
  }

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
            link={`https://${deskproUser?.orgName}.pipedrive.com/activities/list/user/everyone?selected=${activity.id}`}
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
