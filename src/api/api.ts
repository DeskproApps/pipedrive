import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { PipedriveAPIResponse } from "../types/pipedrive/pipedrive";
import { IPipedriveCreateContact } from "../types/pipedrive/pipedriveCreateContact";

import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { IPipedriveActivity } from "../types/pipedrive/pipedriveActivity";
import { IPipedriveNote } from "../types/pipedrive/pipedriveNote";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import { IPipedrivePipeline } from "../types/pipedrive/pipedrivePipeline";
import { IPipedriveStage } from "../types/pipedrive/pipedriveStage";
import { IPipedriveCreateDeal } from "../types/pipedrive/pipedriveCreateDeal";

const pipedriveGet = async (
  client: IDeskproClient,
  orgName: string,
  pathQuery: string
) => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/${pathQuery}`
  ).then((res) => res.json());

  return response;
};

const getUserDataPipedrive = async (
  client: IDeskproClient,
  orgName: string
) => {
  return await pipedriveGet(client, orgName, `users/me?api_token=__api_key__`);
};

const getUserListPipedrive = async (
  client: IDeskproClient,
  orgName: string
) => {
  return await pipedriveGet(client, orgName, `users?api_token=__api_key__`);
};

const getUserById = async (
  client: IDeskproClient,
  orgName: string,
  id: string
) => {
  return await pipedriveGet(
    client,
    orgName,
    `users/${id}?api_token=__api_key__`
  );
};

const getContactByPrompt = async (
  client: IDeskproClient,
  orgName: string,
  prompt: string
) => {
  return await pipedriveGet(
    client,
    orgName,
    `persons/search?term=${prompt}&api_token=__api_key__`
  );
};

const getAllUsers = async (
  client: IDeskproClient,
  orgName: string
): Promise<PipedriveAPIResponse<IPipedriveUser[]>> => {
  return await pipedriveGet(client, orgName, `users?api_token=__api_key__`);
};

const getAllOrganizations = async (
  client: IDeskproClient,
  orgName: string
): Promise<PipedriveAPIResponse<IPipedriveOrganization[]>> => {
  return await pipedriveGet(
    client,
    orgName,
    `organizations?api_token=__api_key__`
  );
};

const getContactById = async (
  client: IDeskproClient,
  orgName: string,
  id: string
): Promise<PipedriveAPIResponse<IPipedriveContact>> => {
  return await pipedriveGet(
    client,
    orgName,
    `persons/${id}?api_token=__api_key__`
  );
};

const getOrganizationsByUserId = async (
  client: IDeskproClient,
  orgName: string,
  userId: number
) => {
  return await pipedriveGet(
    client,
    orgName,
    `organizations?user_id=${userId}&api_token=__api_key__`
  );
};

const getDeals = async (
  client: IDeskproClient,
  orgName: string,
  personId: number
): Promise<PipedriveAPIResponse<IPipedriveDeal[]>> => {
  return await pipedriveGet(
    client,
    orgName,
    `deals?person_id=${personId}&&api_token=__api_key__`
  );
};

const getOrganizationsById = async (
  client: IDeskproClient,
  orgName: string,
  orgId: number
): Promise<PipedriveAPIResponse<IPipedriveOrganization>> => {
  return await pipedriveGet(
    client,
    orgName,
    `organizations/${orgId}?api_token=__api_key__`
  );
};

const getNotes = async (
  client: IDeskproClient,
  orgName: string,
  personId: number
): Promise<PipedriveAPIResponse<IPipedriveNote[]>> => {
  return await pipedriveGet(
    client,
    orgName,
    `notes?person_id=${personId}&api_token=__api_key__`
  );
};

const getActivitiesByUserId = async (
  client: IDeskproClient,
  orgName: string,
  userId: number
): Promise<PipedriveAPIResponse<IPipedriveActivity[]>> => {
  return await pipedriveGet(
    client,
    orgName,
    `activities?user_id=${userId}&api_token=__api_key__`
  );
};

const createContact = async (
  client: IDeskproClient,
  orgName: string,
  data: IPipedriveCreateContact
): Promise<PipedriveAPIResponse<IPipedriveContact>> => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/persons?api_token=__api_key__`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};

const getDealById = async (
  client: IDeskproClient,
  orgName: string,
  dealId: number
): Promise<PipedriveAPIResponse<IPipedriveDeal>> => {
  return await pipedriveGet(
    client,
    orgName,
    `deals/${dealId}?api_token=__api_key__`
  );
};

const getPipelineById = async (
  client: IDeskproClient,
  orgName: string,
  pipelineId: number
): Promise<PipedriveAPIResponse<IPipedrivePipeline>> => {
  return await pipedriveGet(
    client,
    orgName,
    `pipelines/${pipelineId}?api_token=__api_key__`
  );
};

const getStageById = async (
  client: IDeskproClient,
  orgName: string,
  stageId: number
): Promise<PipedriveAPIResponse<IPipedriveStage>> => {
  return await pipedriveGet(
    client,
    orgName,
    `stages/${stageId}?api_token=__api_key__`
  );
};

const createDeal = async (
  client: IDeskproClient,
  orgName: string,
  data: IPipedriveCreateDeal
): Promise<PipedriveAPIResponse<IPipedriveDeal>> => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/deals?api_token=__api_key__`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};

const createUser = async (
  client: IDeskproClient,
  orgName: string,
  user: IPipedriveContact
) => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/users?api_token=__api_key__`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
      }),
    }
  );

  return await response.json();
};

const getContactByEmail = async (
  client: IDeskproClient,
  orgName: string,
  email: string
): Promise<IPipedriveContact | null> => {
  const pipedriveContactFromPrompt = await getContactByPrompt(
    client,
    orgName,
    email
  );

  if (
    !pipedriveContactFromPrompt.success ||
    pipedriveContactFromPrompt.data.items.length === 0
  ) {
    return null;
  }

  const pipedriveContact = await getContactById(
    client,
    orgName,
    pipedriveContactFromPrompt.data.items[0]?.item.id ?? null
  );

  if (!pipedriveContact.success) {
    return null;
  }

  return pipedriveContact.data;
};

const getAllPipelines = async (
  client: IDeskproClient,
  orgName: string
): Promise<PipedriveAPIResponse<IPipedrivePipeline[]>> => {
  return await pipedriveGet(client, orgName, `pipelines?api_token=__api_key__`);
};

const getAllContacts = async (
  client: IDeskproClient,
  orgName: string
): Promise<PipedriveAPIResponse<IPipedriveContact[]>> => {
  return await pipedriveGet(client, orgName, `persons?api_token=__api_key__`);
};

export {
  getAllContacts,
  getAllPipelines,
  createDeal,
  getContactByEmail,
  getStageById,
  getPipelineById,
  getDealById,
  getAllUsers,
  getAllOrganizations,
  getNotes,
  getActivitiesByUserId,
  getContactById,
  getDeals,
  getContactByPrompt,
  getUserDataPipedrive,
  getUserListPipedrive,
  getOrganizationsByUserId,
  getOrganizationsById,
  createContact,
  getUserById,
  createUser,
};
