import { Fragment } from "react";
import {
  Title,
  TwoProperties,
  HorizontalDivider,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { getDeals } from "../api/api";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { PipedriveLogo } from "./PipedriveLogo";
import { RouterLink } from "./Link";
import { useUser } from "../context/userContext";
import { format } from "../utils/date/format";

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
    <>
      <Title
        title={`Deals (${deals.length})`}
        onClick={() => navigate("/createdeal")}
      />
      {deals.map((deal) => (
        <Fragment key={deal.id}>
          <Title
            title={(
              <RouterLink to={`/dealdetails/${deal.id}`}>{deal.title}</RouterLink>
            )}
            link={`https://${deskproUser?.orgName}.pipedrive.com/deal/${deal.id}`}
            icon={<PipedriveLogo/>}
          />
          <TwoProperties
            leftText={format(deal.add_time.split(" ")[0] || "-")}
            rightText={`${Intl.NumberFormat("en-IN").format(deal.value)} ${deal.currency}`}
          />
          <HorizontalDivider style={{marginBottom: 10}}/>
        </Fragment>
      ))}
    </>
  );
};
