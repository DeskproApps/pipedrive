import { IDeskproClient, proxyFetch, adminGenericProxyFetch } from "@deskpro/app-sdk";
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
import { IPipedriveActivityType } from "../types/pipedrive/pipedriveActivityTypes";
import { IPipedriveCreateActivity } from "../types/pipedrive/pipedriveCreateActivity";
import { Settings } from "../types/settings";

type ErrorData = {
  success: false;
  errorCode: number;
  error: string;
  error_info: string;
};

class PipeDriveError extends Error {
  data: ErrorData;

  constructor(data: ErrorData) {
    super("PipeDrive Api Error");
    this.data = data;
  }
}

const pipedriveGet = async (
  client: IDeskproClient,
  orgName: string,
  pathQuery: string
) => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/${pathQuery}`
  );

  let result;

  try {
    result = await response.json();
  } catch (e) {
    result = null;
  }

  if (!result?.success) {
    throw new PipeDriveError(result);
  }

  return result;
};

const preInstalledRequest = async (
  client: IDeskproClient,
  pathQuery: string,
  settings?: Settings,
) => {
  const dpFetch = await adminGenericProxyFetch(client);
  const { api_key, instance_domain } = settings ?? {};

  if (!api_key || !instance_domain) {
    throw new Error("Invalid settings");
  }

  const res = await dpFetch(
      `https://${instance_domain}.pipedrive.com/v1/${pathQuery}?api_token=${api_key}`
  );

  if (res.status < 200 || res.status > 399) {
    throw new Error(await res.text());
  }

  try {
    return await res.json();
  } catch (e) {
    return {};
  }
};

const getUserDataPipedrive = async (
  client: IDeskproClient,
  orgName: string
) => {
  return await pipedriveGet(client, orgName, `users/me?api_token=__api_key__`);
};

const getActivityTypes = async (
  client: IDeskproClient,
  orgName: string
): Promise<PipedriveAPIResponse<IPipedriveActivityType[]>> => {
  return await pipedriveGet(
    client,
    orgName,
    `activityTypes?api_token=__api_key__`
  );
};

const getUserListPipedrive = async (
  client: IDeskproClient,
  orgName: string
) => {
  return await pipedriveGet(client, orgName, `users?api_token=__api_key__`);
};

const getCurrentUser = async (
  client: IDeskproClient,
  orgName?: string,
  settings?: Settings,
): Promise<{ data: IPipedriveUser }> => {
  return (settings?.api_key && settings?.instance_domain)
    ? await preInstalledRequest(client, `users/me`, settings)
    : await pipedriveGet(client, orgName as string, `users/me?api_token=__api_key__`);
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

  let result;

  try {
    result = await response.json();
  } catch (e) {
    result = null;
  }

  if (!result?.success) {
    throw new PipeDriveError(result);
  }

  return result;
};

const editContact = async (
  client: IDeskproClient,
  orgName: string,
  data: IPipedriveCreateContact,
  contactId: string
): Promise<PipedriveAPIResponse<IPipedriveContact>> => {
  const pFetch = await proxyFetch(client);

  Object.keys(data).forEach((key) => {
    if (!data[key as keyof typeof data]) {
      delete data[key as keyof typeof data];
    }
  });

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/persons/${contactId}?api_token=__api_key__`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  let result;

  try {
    result = await response.json();
  } catch (e) {
    result = null;
  }

  if (!result?.success) {
    throw new PipeDriveError(result);
  }

  return result;
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

const editDeal = async (
  client: IDeskproClient,
  orgName: string,
  data: IPipedriveCreateDeal,
  dealId: string
): Promise<PipedriveAPIResponse<IPipedriveDeal>> => {
  const pFetch = await proxyFetch(client);

  Object.keys(data).forEach((key) => {
    if (!data[key as keyof typeof data]) {
      delete data[key as keyof typeof data];
    }
  });

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/deals/${dealId}?api_token=__api_key__`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return response.json();
};

const createActivity = async (
  client: IDeskproClient,
  orgName: string,
  data: IPipedriveCreateActivity
): Promise<PipedriveAPIResponse<IPipedriveActivity>> => {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/activities?api_token=__api_key__`,
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

const uploadImage = async (
  client: IDeskproClient,
  orgName: string,
  image: File,
  contactId: string
) => {
  const pFetch = await proxyFetch(client);

  const formData = new FormData();

  formData.set(
    "file",
    new Blob([await image.arrayBuffer()], { type: image.type }),
    image.name
  );
  formData.set("person_id", contactId);

  const response = await pFetch(
    `https://${orgName}.pipedrive.com/v1/files?api_token=__api_key__`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
};

const createNote = async (
  client: IDeskproClient,
  orgName: string,
  image: File | null,
  note: string,
  contactId: string
): Promise<PipedriveAPIResponse<IPipedriveNote>> => {
  const pFetch = await proxyFetch(client);

  let requestNote = null;

  if (image) {
    const imageResponse = await uploadImage(client, orgName, image, contactId);

    requestNote = `${note}<br><a href="cid:${imageResponse?.data?.id}" target="_blank" data-pipecid="cid:${imageResponse?.data?.id}"><img src="cid:${imageResponse?.data?.id}" data-pipecid="cid:${imageResponse?.data?.id}" style="width: 64px; height: 64px;"></a>`;
  } else {
    requestNote = note;
  }

  const noteResponse = await pFetch(
    `https://${orgName}.pipedrive.com/v1/notes?api_token=__api_key__`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: requestNote,
        person_id: contactId,
      }),
    }
  );

  return noteResponse.json();
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

const getAllStages = async (
  client: IDeskproClient,
  orgName: string
): Promise<PipedriveAPIResponse<IPipedriveStage[]>> => {
  return await pipedriveGet(client, orgName, `stages?api_token=__api_key__`);
};

const getAllContacts = async (
  client: IDeskproClient,
  orgName: string
): Promise<PipedriveAPIResponse<IPipedriveContact[]>> => {
  return await pipedriveGet(client, orgName, `persons?api_token=__api_key__`);
};

const getAllDeals = async (
  client: IDeskproClient,
  orgName: string
): Promise<PipedriveAPIResponse<IPipedriveDeal[]>> => {
  return await pipedriveGet(client, orgName, `deals?api_token=__api_key__`);
};

export const getImage = (client: IDeskproClient, orgName: string, imageId: string) => {
  return proxyFetch(client)
    .then((fetch) => fetch(`https://${orgName}.pipedrive.com/v1/files/${imageId}/download?api_token=__api_key__`))
    .then((res) => res.blob());
};

export {
  getAllStages,
  editContact,
  editDeal,
  createNote,
  createActivity,
  getAllDeals,
  getActivityTypes,
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
  pipedriveGet,
  getCurrentUser,
  PipeDriveError,
};
