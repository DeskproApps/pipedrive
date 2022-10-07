import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { ICreateContact } from "../types/createContact";

import { IPipedriveUser } from "../types/pipedriveUser";

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

const getContactById = async (client: IDeskproClient, id: string) => {
  return await pipedriveGet(client, `persons/${id}?api_token=__api_key__`);
};

const getOrganizations = async (client: IDeskproClient, orgId: string) => {
  return await pipedriveGet(
    client,
    `organization/${orgId}?api_token=__api_key__`
  );
};

const createContact = async (client: IDeskproClient, data: ICreateContact) => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/users?api_token=__api_key__`,
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

const createUser = async (client: IDeskproClient, user: IPipedriveUser) => {
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
  getContactById,
  getContactByPrompt,
  getUserDataPipedrive,
  getUserListPipedrive,
  getOrganizations,
  createContact,
  getUserById,
  createUser,
};
