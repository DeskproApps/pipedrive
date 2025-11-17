import {
  Property,
  LoadingSpinner,
  HorizontalDivider,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDealById, getPipelineById, getStageById } from "../api/api";
import { useUser } from "../context/userContext";
import { format } from "../utils/date/format";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { Container } from "../components/common";

export const DealDetails = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();

  const [deal, setDeal] = useState<IPipedriveDeal | null>(null);
  const [pipeline, setPipeline] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState<string>("");
  const user = useUser();

  useInitialisedDeskproAppClient(
    async (client) => {
      if (!user || !dealId) return;

      client.deregisterElement("pipedriveRefreshButton");

      client.deregisterElement("pipedriveMenuButton");

      client.registerElement("pipedriveEditButton", {
        type: "edit_button",
      });

      client.registerElement("pipedriveLink", {
        type: "cta_external_link",
        url: `https://__instance_domain__.pipedrive.com/deal/${dealId}`,
        hasIcon: true,
      });

      client.setTitle("Deal Details");

      const dealRes = await getDealById(client, Number(dealId));

      if (!dealRes.success) {
        return;
      }

      setDeal(dealRes.data);

      const pipelineRes = await getPipelineById(
        client,
        dealRes.data.pipeline_id
      );

      if (pipelineRes.success) {
        setPipeline(pipelineRes.data.name);
      }

      const stageRes = await getStageById(
        client,
        dealRes.data.stage_id
      );

      if (stageRes.success) {
        setStage(stageRes.data.name);
      }
      setIsLoading(false);
    },
    [user]
  );

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "pipedriveHomeButton": {
          navigate("/redirect");
          break;
        }
        case "pipedriveEditButton": {
          navigate(`/editdeal/${dealId}`);

          break;
        }
      }
    },
  });

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <Container>
      {deal?.title && <Property label="Deal Title" text={deal?.title}/>}
      {deal?.person_id.name && (
        <Property label="Contact person" text={deal?.person_id.name}/>
      )}
      {deal?.org_id?.name && (
        <Property label="Organization" text={deal?.org_id?.name}/>
      )}
      {pipeline && <Property label="Pipeline" text={pipeline}/>}
      {stage && <Property label="Stage" text={stage}/>}
      {deal?.formatted_weighted_value && (
        <Property label="Value" text={deal?.formatted_weighted_value}/>
      )}
      {deal?.owner_name && (
        <Property label="Owner" text={deal?.owner_name}/>
      )}
      {deal?.expected_close_date && (
        <Property label="Expected close date" text={format(deal?.expected_close_date) || "-"}/>
      )}
      <HorizontalDivider/>
    </Container>
  );
};
