/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  H2,
  P5,
  HorizontalDivider,
  Stack,
  useInitialisedDeskproAppClient,
  VerticalDivider,
  Title,
  Property,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { getDeals } from "../api/api";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { PipedriveLogo } from "./PipedriveLogo";
import { RouterLink } from "./Link";
import { useUser } from "../context/userContext";

export const DealsMainView = ({
  contact,
  orgName,
}: {
  contact: IPipedriveContact;
  orgName: string;
}) => {
  const navigate = useNavigate();
  const deskproUser = useUser();
  const [deals, setDeals] = useState<IPipedriveDeal[]>([]);

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!contact.owner_id.id || !contact.id) return;

      const dealsReq = await getDeals(client, orgName, contact.owner_id.id);

      if (!dealsReq.success) return;

      setDeals(
        dealsReq?.data?.filter((e) => e.person_id.value === contact.id) ?? []
      );
    },
    [contact]
  );

  return (
    <Stack vertical style={{ width: "100%" }}>
      <Title
        title={`Deals (${deals.length})`}
        onClick={() => navigate("/createdeal")}
      />
      <Stack vertical style={{ width: "100%" }}>
        {deals.map((deal, i) => {
          return (
            <Stack
              key={i}
              vertical
              gap={5}
              style={{ width: "100%", marginTop: "5px" }}
            >
              <Stack vertical align="stretch" style={{ width: "100%" }}>
                <Title
                  title={(
                    <RouterLink to={`/dealdetails/${deal.id}`}>{deal.title}</RouterLink>
                  )}
                  link={`https://${deskproUser?.orgName}.pipedrive.com/deal/${deal.id}`}
                  icon={<PipedriveLogo/>}
                />
              </Stack>
              <Stack>
                <Property>{deal.add_time.split(" ")[0]}</Property>
                <Stack style={{ marginLeft: "40px" }}>
                  <VerticalDivider
                    style={{
                      height: "15px",
                      width: "1px",
                      color: "#EFF0F0",
                      marginLeft: "15px",
                    }}
                  ></VerticalDivider>
                  <Property>
                    {`${Intl.NumberFormat("en-IN").format(deal.value)} ${deal.currency}`}
                  </Property>
                </Stack>
              </Stack>
              <HorizontalDivider
                style={{
                  width: "110%",
                  color: "#EFF0F0",
                  marginLeft: "-10px",
                  marginBottom: "5px",
                }}
              />
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
