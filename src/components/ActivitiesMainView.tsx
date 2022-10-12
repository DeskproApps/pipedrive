import {
  HorizontalDivider,
  Property,
  Stack,
  VerticalDivider,
} from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { LogoAndLinkButton } from "./LogoAndLinkButton";

const activities = [
  {
    name: "Call Michael",
    type: "Call",
    Date: "15 Mar, 2021",
  },
  {
    name: "Email Anderson",
    type: "Email",
    Date: "15 Mar, 2021",
  },
];

export const ActivitiesMainView = () => {
  return (
    <Stack vertical style={{ width: "100%" }}>
      <Stack
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack gap={"2px"}>
          <h1 style={{ alignSelf: "center", fontSize: "12px" }}>
            Activities ({activities.length})
          </h1>
          <FontAwesomeIcon
            icon={faPlus}
            style={{ alignSelf: "center", width: "12px", marginLeft: "5px" }}
          ></FontAwesomeIcon>
        </Stack>
      </Stack>
      <Stack vertical style={{ width: "100%" }}>
        {activities.map((activity) => {
          return (
            <Stack
              vertical
              gap={5}
              style={{ width: "100%", marginTop: "10px" }}
            >
              <Stack
                style={{
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <h1 style={{ fontSize: "12px" }}>{activity.name}</h1>
                <LogoAndLinkButton />
              </Stack>
              <Stack>
                <Property title="Type">{activity.type}</Property>
                <Stack style={{ marginLeft: "40px" }}>
                  <VerticalDivider
                    style={{ height: "30px", width: "1px", color: "#EFF0F0" }}
                  ></VerticalDivider>
                  <Property title="Date">{activity.Date}</Property>
                </Stack>
              </Stack>
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
