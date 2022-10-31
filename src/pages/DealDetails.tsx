import {
  HorizontalDivider,
  Spinner,
  Stack,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Property } from "../components/Property";
import { getDealById, getPipelineById, getStageById } from "../api/api";
import { useUser } from "../context/userContext";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";

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
        url: `https://${user?.orgName}.pipedrive.com/deal/${dealId}`,
        hasIcon: true,
      });

      client.setTitle("Deal Details");

      const dealRes = await getDealById(client, user.orgName, Number(dealId));

      if (!dealRes.success) {
        return;
      }

      setDeal(dealRes.data);

      const pipelineRes = await getPipelineById(
        client,
        user.orgName,
        dealRes.data.pipeline_id
      );

      if (pipelineRes.success) {
        setPipeline(pipelineRes.data.name);
      }

      const stageRes = await getStageById(
        client,
        user.orgName,
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
    async onElementEvent(id) {
      switch (id) {
        case "pipedriveEditButton": {
          navigate(`/editdeal/${dealId}`);

          break;
        }
      }
    },
  });

  return isLoading ? (
    <Stack
      style={{
        margin: "auto",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner size="extra-large" />
    </Stack>
  ) : (
    <Stack vertical gap={10}>
      {deal?.title && <Property title="Deal Title">{deal?.title}</Property>}
      {deal?.person_id.name && (
        <Property title="Contact person">{deal?.person_id.name}</Property>
      )}
      {deal?.org_id?.name && (
        <Property title="Organization">{deal?.org_id?.name}</Property>
      )}
      {pipeline && <Property title="Pipeline">{pipeline}</Property>}
      {stage && <Property title="Stage">{stage}</Property>}
      {deal?.formatted_weighted_value && (
        <Property title="Value">{deal?.formatted_weighted_value}</Property>
      )}
      {deal?.owner_name && (
        <Property title="Owner">{deal?.owner_name}</Property>
      )}
      {deal?.expected_close_date && (
        <Property title="Expected close date">
          {deal?.expected_close_date}
        </Property>
      )}
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
};
