import {
  H1,
  HorizontalDivider,
  Stack,
  useInitialisedDeskproAppClient,
  VerticalDivider,
} from "@deskpro/app-sdk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { LogoAndLinkButton } from "./LogoAndLinkButton";
import { useState } from "react";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { getDeals } from "../api/api";

export const DealsMainView = ({
  userId,
  personId,
}: {
  userId: number;
  personId: number;
}) => {
  const [deals, setDeals] = useState<IPipedriveDeal[]>([]);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!userId || !personId) return;

      const dealsReq = await getDeals(client, userId);

      if (!dealsReq.success) return;

      setDeals(dealsReq.data.filter((e) => e.person_id.value === personId));
    },
    [userId, personId]
  );

  return (
    <Stack vertical style={{ width: "100%" }}>
      <Stack
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack gap={"2px"} style={{ alignItems: "center" }}>
          <h1 style={{ fontSize: "12px" }}>Deals ({deals.length})</h1>
          <FontAwesomeIcon
            icon={faPlus}
            style={{ width: "12px", marginLeft: "5px" }}
          ></FontAwesomeIcon>
        </Stack>
        <LogoAndLinkButton />
      </Stack>
      <Stack vertical style={{ width: "100%" }}>
        {deals.map((deal, i) => {
          return (
            <Stack
              key={i}
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
                <h1 style={{ color: "#3A8DDE", fontSize: "12px" }}>
                  {deal.title}
                </h1>
                <LogoAndLinkButton />
              </Stack>
              <Stack>
                <H1>{deal.add_time.split(" ")[0]}</H1>
                <Stack style={{ marginLeft: "40px" }}>
                  <VerticalDivider
                    style={{ height: "10px", width: "1px", color: "#EFF0F0" }}
                  ></VerticalDivider>
                  <H1>{deal.formatted_weighted_value}</H1>
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
