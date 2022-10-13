import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { PipedriveAPIResponse } from "../types/pipedrive/pipedrive";
import { ICreateContact } from "../types/createContact";

import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { IPipedriveActivity } from "../types/pipedrive/pipedriveActivity";
import { IPipedriveNote } from "../types/pipedrive/pipedriveNote";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";

const pipedriveGet = async (client: IDeskproClient, pathQuery: string) => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/${pathQuery}`
  ).then((res) => res.json());

  return response;
};

const getUserDataPipedrive = async (client: IDeskproClient) => {
  return await pipedriveGet(client, `users/me?api_token=__api_key__`);
};

const getUserListPipedrive = async (client: IDeskproClient) => {
  return await pipedriveGet(client, `users?api_token=__api_key__`);
};

const getUserById = async (client: IDeskproClient, id: string) => {
  return await pipedriveGet(client, `users/${id}?api_token=__api_key__`);
};

const getContactByPrompt = async (client: IDeskproClient, prompt: string) => {
  return await pipedriveGet(
    client,
    `persons/search?term=${prompt}&api_token=__api_key__`
  );
};

const getAllUsers = async (
  client: IDeskproClient
): Promise<PipedriveAPIResponse<IPipedriveUser[]>> => {
  return await pipedriveGet(client, `users?api_token=__api_key__`);
};

const getAllOrganizations = async (
  client: IDeskproClient
): Promise<PipedriveAPIResponse<IPipedriveOrganization[]>> => {
  return await pipedriveGet(client, `organizations?api_token=__api_key__`);
};

const getContactById = async (
  client: IDeskproClient,
  id: string
): Promise<PipedriveAPIResponse<IPipedriveContact>> => {
  return await pipedriveGet(client, `persons/${id}?api_token=__api_key__`);
};

const getOrganizationsByUserId = async (
  client: IDeskproClient,
  userId: number
) => {
  return await pipedriveGet(
    client,
    `organizations?user_id=${userId}&api_token=__api_key__`
  );
};

const getDeals = async (
  client: IDeskproClient,
  personId: number
): Promise<PipedriveAPIResponse<IPipedriveDeal[]>> => {
  return await pipedriveGet(
    client,
    `deals?person_id=${personId}&&api_token=__api_key__`
  );
};

const getOrganizationsById = async (
  client: IDeskproClient,
  orgId: number
): Promise<PipedriveAPIResponse<IPipedriveOrganization>> => {
  return await pipedriveGet(
    client,
    `organizations/${orgId}?api_token=__api_key__`
  );
};

const getNotes = async (
  client: IDeskproClient,
  personId: number
): Promise<PipedriveAPIResponse<IPipedriveNote[]>> => {
  return await pipedriveGet(
    client,
    `notes?person_id=${personId}&api_token=__api_key__`
  );
};

const getActivitiesByUserId = async (
  client: IDeskproClient,
  userId: number
): Promise<PipedriveAPIResponse<IPipedriveActivity[]>> => {
  return await pipedriveGet(
    client,
    `activities?user_id=${userId}&api_token=__api_key__`
  );
};

const createContact = async (client: IDeskproClient, data: ICreateContact) => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/persons?api_token=__api_key__`,
    {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        primary_email: data.primary_email,
        phone: data.phone,
        org_id: data.org_id,
        owner_id: data.owner_id,
      }),
    }
  );

  if (response.status.toString().startsWith("2")) {
    throw new Error("Error creating contact");
  }
};

const createUser = async (client: IDeskproClient, user: IPipedriveContact) => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/users?api_token=__api_key__`,
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

  if (!response.status.toString().startsWith("2")) {
    throw new Error("Error creating contact");
  }

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
