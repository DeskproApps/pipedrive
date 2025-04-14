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
import { getAllContactDeals } from "../api/api";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { PipedriveLogo } from "./PipedriveLogo";
import { RouterLink } from "./Link";
import { useUser } from "../context/userContext";
import { format } from "../utils/date/format";
import { Spinner, Stack } from "@deskpro/deskpro-ui";

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
  const [isFetchingDeals, setIsFetchingDeals] = useState<boolean>(true);


  useInitialisedDeskproAppClient(
    async (client) => {
      if (!contact.owner_id.id || !contact.id) {
        return
      }

      setIsFetchingDeals(true)

      try {
        const dealsReq = await getAllContactDeals(client, orgName, contact.id)
        if (!dealsReq.success) {
          return
        }
        setDeals(
          dealsReq?.data ?? []
        )
      } catch {
        setDeals([])
      } finally {
        setIsFetchingDeals(false)
      }
    },
    [contact]
  );

  if (isFetchingDeals) {
      return (
        <>
          <Title
            title={`Deals`}
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
            icon={<PipedriveLogo />}
          />
          <TwoProperties
            leftText={format(deal.add_time.split(" ")[0] || "-")}
            rightText={`${Intl.NumberFormat("en-IN").format(deal.value)} ${deal.currency}`}
          />
          <HorizontalDivider style={{ marginBottom: 10 }} />
        </Fragment>
      ))}
    </>
  );
};
