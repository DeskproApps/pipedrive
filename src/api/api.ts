import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { PipedriveAPIResponse } from "../types/pipedrive/pipedrive";
import { ICreateContact } from "../types/createContact";

import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { IPipedriveActivity } from "../types/pipedrive/pipedriveActivity";
import { IPipedriveNote } from "../types/pipedrive/pipedriveNote";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";

const pipedriveGet = async (
  client: IDeskproClient,
  orgName: string,
  pathQuery: string
) => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/${pathQuery}`
  );

  if (!response.status.toString().startsWith("2")) {
    throw new Error("Error getting " + pathQuery);
  }

  return await response.json();
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
  data: ICreateContact
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

  if (!response.status.toString().startsWith("2")) {
    throw new Error("Error creating contact");
  }

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

export {
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
