import { adminGenericProxyFetch, IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { IPipedriveActivity } from "../types/pipedrive/pipedriveActivity";
import { IPipedriveActivityType } from "../types/pipedrive/pipedriveActivityTypes";
import { IPipedriveContact } from "../types/pipedrive/pipedriveContact";
import { IPipedriveCreateActivity } from "../types/pipedrive/pipedriveCreateActivity";
import { IPipedriveCreateContact } from "../types/pipedrive/pipedriveCreateContact";
import { IPipedriveCreateDeal } from "../types/pipedrive/pipedriveCreateDeal";
import { IPipedriveDeal } from "../types/pipedrive/pipedriveDeal";
import { IPipedriveNote } from "../types/pipedrive/pipedriveNote";
import { IPipedriveOrganization } from "../types/pipedrive/pipedriveOrganization";
import { IPipedrivePipeline } from "../types/pipedrive/pipedrivePipeline";
import { IPipedriveStage } from "../types/pipedrive/pipedriveStage";
import { IPipedriveUser } from "../types/pipedrive/pipedriveUser";
import { PipedriveAdditionalData, PipedriveAPIResponse, PipedriveFilterOptions } from "../types/pipedrive/pipedrive";
import { Settings } from "../types/settings";

/**
 * Utility to prevent rate limits when making successive requests
 * 
 * @param delayPeriod - Number of milliseconds to wait before continuing
 * @returns A Promise that resolves after the given delay
 *
 */
function pipedriveDelay(delayPeriod: number) {
  return new Promise(resolve => setTimeout(resolve, delayPeriod));
}

type ErrorData = {
  success: false;
  errorCode: number;
  error: string;
  error_info: string;
};

export class PipeDriveError extends Error {
  data: ErrorData;

  constructor(data: ErrorData) {
    super("PipeDrive Api Error");
    this.data = data;
  }
}

interface PipedriveGetProps {
  client: IDeskproClient
  endpoint: string
  apiVersion?: 1 | 2
}

/**
 * Fetches data from the Pipedrive API. (Only GET requests)
 *
 * @param {IDeskproClient} client - The Deskpro client.
 * @param {string} endpoint - The specific API endpoint to call (e.g. "persons").
 * @param {number} apiVersion - Optional API version (defaults to v1).
 *
 * @example
 * // Get a contact using API v1
 * const response = await pipedriveGet({
 *   client
 *   endpoint: "persons/1",
 *   apiVersion: 1
 * });
 *
 * @example
 * // Get all contacts using API v2
 * const response = await pipedriveGet({
 *   client,
 *   endpoint: "persons",
 *   apiVersion: 2
 * });
 */
export async function pipedriveGet(props: PipedriveGetProps) {
  const { client, endpoint, apiVersion } = props
  const pFetch = await proxyFetch(client);

  const apiVersionRoute = apiVersion === 2 ? "api/v2" : "v1"

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/${apiVersionRoute}/${endpoint}`
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

export async function preInstalledRequest(
  client: IDeskproClient,
  pathQuery: string,
  settings?: Settings,
) {
  const dpFetch = await adminGenericProxyFetch(client);
  const { api_key, instance_domain } = settings ?? {};

  if (!api_key || !instance_domain) {
    throw new Error("Invalid settings");
  }

  const res = await dpFetch(
    `https://__instance_domain__.pipedrive.com/v1/${pathQuery}?api_token=${api_key}`
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

export async function fetchAllPaginatedData<T>(
  fetchFunction: (cursor?: string | null) => Promise<PipedriveAPIResponse<T[]> & {
    additional_data?: Pick<NonNullable<PipedriveAdditionalData["additional_data"]>, "next_cursor">
  }>,
  delayBetweenPages?: number
): Promise<{ success: boolean, data: T[], hasErrors: boolean }> {
  const items: T[] = []
  let hasErrors = false
  let pagesFetched = 0
  let hasMorePages = true
  let nextCursor: string | null = null

  // Continue fetching pages until there's no more data or an error occurs.
  while (hasMorePages && !hasErrors) {
    try {
      const response = await fetchFunction(nextCursor)

      if (!response.success) {
        hasErrors = true
        break
      }

      pagesFetched++
      items.push(...response.data)

      // Update the cursor for the next request. If null, we've reached the end of results.
      nextCursor = response.additional_data?.next_cursor ?? null
      hasMorePages = nextCursor !== null

      // Throttle requests to avoid hitting Pipedrive API's rate limit.
      if (hasMorePages) {
        await pipedriveDelay(delayBetweenPages ?? 250)
      }
    } catch {
      hasErrors = true
      break
    }
  }

  return {
    success: pagesFetched > 0, // true if we got at least one successful page so the user can have something to view.
    data: items,
    hasErrors
  };
}

export async function getUserDataPipedrive(
  client: IDeskproClient,
) {
  return await pipedriveGet({ client, endpoint: `users/me?api_token=__api_key__` });
};

export async function getActivityTypes(
  client: IDeskproClient,
): Promise<PipedriveAPIResponse<IPipedriveActivityType[]>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `activityTypes?api_token=__api_key__`
    }
  );
};

export async function getUserListPipedrive(
  client: IDeskproClient,
) {
  return await pipedriveGet({ client, endpoint: `users?api_token=__api_key__` });
};

export async function getCurrentUser(
  client: IDeskproClient,
  settings?: Settings,
): Promise<{ data: IPipedriveUser }> {
  return (settings?.api_key && settings?.instance_domain)
    ? await preInstalledRequest(client, `users/me`, settings)
    : await pipedriveGet({ client, endpoint: `users/me?api_token=__api_key__` });
};

export async function getUserById(
  client: IDeskproClient,
  id: string
) {
  return await pipedriveGet(
    {
      client,
      endpoint: `users/${id}?api_token=__api_key__`
    }
  );
};

export async function getContactByPrompt(
  client: IDeskproClient,
  prompt: string
) {
  return await pipedriveGet({
    client,
    endpoint: `persons/search?term=${prompt}&api_token=__api_key__`
  }
  );
};

export async function getAllUsers(
  client: IDeskproClient,
): Promise<PipedriveAPIResponse<IPipedriveUser[]>> {
  return await pipedriveGet({ client, endpoint: `users?api_token=__api_key__` });
};

export async function getAllOrganizations(
  client: IDeskproClient,
): Promise<PipedriveAPIResponse<IPipedriveOrganization[]>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `organizations?api_token=__api_key__`
    }
  );
};

export async function getContactById(
  client: IDeskproClient,
  id: string
): Promise<PipedriveAPIResponse<IPipedriveContact>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `persons/${id}?api_token=__api_key__`
    }
  );
};

export async function getOrganizationsByUserId(
  client: IDeskproClient,
  userId: number
) {
  return await pipedriveGet(
    {
      client,
      endpoint: `organizations?user_id=${userId}&api_token=__api_key__`
    }
  );
};

export async function getDeals(
  client: IDeskproClient,
  personId: number
): Promise<PipedriveAPIResponse<IPipedriveDeal[]>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `deals?person_id=${personId}&api_token=__api_key__`
    }
  );
};

export async function getAllContactDeals(
  client: IDeskproClient,
  contactId: number
) {
  return await fetchAllPaginatedData((cursor) => getDealsByContactId(client, contactId, { cursor: cursor ?? undefined, limit: 500 }))
}

export async function getDealsByContactId(
  client: IDeskproClient,
  contactId: number,
  options?: Pick<PipedriveFilterOptions, "limit" | "cursor">
): Promise<PipedriveAPIResponse<IPipedriveDeal[]> & {
  additional_data?: Pick<
    NonNullable<PipedriveAdditionalData['additional_data']>, "next_cursor"
  >
}> {

  const { limit = 500, cursor } = options ?? {}

  const queryParams = new URLSearchParams({

    api_token: '__api_key__',
    person_id: contactId.toString(),
    limit: limit.toString(),
  });

  if (cursor) {
    queryParams.append('cursor', cursor);
  }

  return await pipedriveGet(
    {
      client,
      apiVersion: 2,
      endpoint: `deals?${queryParams.toString()}`
    }
  )
}

export async function getOrganizationsById(
  client: IDeskproClient,
  orgId: number
): Promise<PipedriveAPIResponse<IPipedriveOrganization>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `organizations/${orgId}?api_token=__api_key__`
    }
  );
};

export async function getNotes(
  client: IDeskproClient,
  personId: number
): Promise<PipedriveAPIResponse<IPipedriveNote[]>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `notes?person_id=${personId}&api_token=__api_key__`
    }
  );
};

export async function getAllContactActivities(
  client: IDeskproClient,
  contactId: number
) {
  return await fetchAllPaginatedData((cursor) => getActivities(client, { personId: contactId, cursor: cursor ?? undefined, limit: 500 }))
}

export async function getActivities(
  client: IDeskproClient,
  options?: Pick<PipedriveFilterOptions, "limit" | "cursor" | "personId" | "ownerId">
): Promise<PipedriveAPIResponse<IPipedriveActivity[]> & {
  additional_data?: Pick<
    NonNullable<PipedriveAdditionalData['additional_data']>, "next_cursor"
  >
}> {
  const { limit = 500, cursor, personId: contactId, ownerId } = options ?? {}

  const queryParams = new URLSearchParams({

    api_token: '__api_key__',
    limit: limit.toString(),
  });

  if (cursor) {
    queryParams.append('cursor', cursor);
  }

  if (contactId) {
    queryParams.append('person_id', contactId.toString());
  }

  if (ownerId) {
    queryParams.append('owner_id', ownerId.toString());
  }

  return await pipedriveGet(
    {
      client,
      apiVersion: 2,
      endpoint: `activities?${queryParams.toString()}`
    }
  );
}

export async function createContact(
  client: IDeskproClient,
  data: IPipedriveCreateContact
): Promise<PipedriveAPIResponse<IPipedriveContact>> {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/persons?api_token=__api_key__`,
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

export async function editContact(
  client: IDeskproClient,
  data: IPipedriveCreateContact,
  contactId: string
): Promise<PipedriveAPIResponse<IPipedriveContact>> {
  const pFetch = await proxyFetch(client);

  Object.keys(data).forEach((key) => {
    if (!data[key as keyof typeof data]) {
      delete data[key as keyof typeof data];
    }
  });

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/persons/${contactId}?api_token=__api_key__`,
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

export async function getDealById(
  client: IDeskproClient,
  dealId: number
): Promise<PipedriveAPIResponse<IPipedriveDeal>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `deals/${dealId}?api_token=__api_key__`
    }
  );
};

export async function getPipelineById(
  client: IDeskproClient,
  pipelineId: number
): Promise<PipedriveAPIResponse<IPipedrivePipeline>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `pipelines/${pipelineId}?api_token=__api_key__`
    }
  );
};

export async function getStageById(
  client: IDeskproClient,
  stageId: number
): Promise<PipedriveAPIResponse<IPipedriveStage>> {
  return await pipedriveGet(
    {
      client,
      endpoint: `stages/${stageId}?api_token=__api_key__`
    }
  );
};

export async function createDeal(
  client: IDeskproClient,
  data: IPipedriveCreateDeal
): Promise<PipedriveAPIResponse<IPipedriveDeal>> {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/deals?api_token=__api_key__`,
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

export async function editDeal(
  client: IDeskproClient,
  data: IPipedriveCreateDeal,
  dealId: string
): Promise<PipedriveAPIResponse<IPipedriveDeal>> {
  const pFetch = await proxyFetch(client);

  Object.keys(data).forEach((key) => {
    if (!data[key as keyof typeof data]) {
      delete data[key as keyof typeof data];
    }
  });

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/deals/${dealId}?api_token=__api_key__`,
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

export async function createActivity(
  client: IDeskproClient,
  data: IPipedriveCreateActivity
): Promise<PipedriveAPIResponse<IPipedriveActivity>> {
  const pFetch = await proxyFetch(client);

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/activities?api_token=__api_key__`,
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

export async function uploadImage(
  client: IDeskproClient,
  image: File,
  contactId: string
) {
  const pFetch = await proxyFetch(client);

  const formData = new FormData();

  formData.set(
    "file",
    new Blob([await image.arrayBuffer()], { type: image.type }),
    image.name
  );
  formData.set("person_id", contactId);

  const response = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/files?api_token=__api_key__`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
};

export async function createNote(
  client: IDeskproClient,
  image: File | null,
  note: string,
  contactId: string
): Promise<PipedriveAPIResponse<IPipedriveNote>> {
  const pFetch = await proxyFetch(client);

  let requestNote = null;

  if (image) {
    const imageResponse = await uploadImage(client, image, contactId);

    requestNote = `${note}<br><a href="cid:${imageResponse?.data?.id}" target="_blank" data-pipecid="cid:${imageResponse?.data?.id}"><img src="cid:${imageResponse?.data?.id}" data-pipecid="cid:${imageResponse?.data?.id}" style="width: 64px; height: 64px;"></a>`;
  } else {
    requestNote = note;
  }

  const noteResponse = await pFetch(
    `https://__instance_domain__.pipedrive.com/v1/notes?api_token=__api_key__`,
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

export async function createUser(
  client: IDeskproClient,
  user: IPipedriveContact
) {
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

  return await response.json();
};

export async function getContactByEmail(
  client: IDeskproClient,
  email: string
): Promise<IPipedriveContact | null> {
  const pipedriveContactFromPrompt = await getContactByPrompt(
    client,
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
    pipedriveContactFromPrompt.data.items[0]?.item.id ?? null
  );

  if (!pipedriveContact.success) {
    return null;
  }

  return pipedriveContact.data;
};

export async function getAllPipelines(
  client: IDeskproClient,
): Promise<PipedriveAPIResponse<IPipedrivePipeline[]>> {
  return await pipedriveGet({ client, endpoint: `pipelines?api_token=__api_key__` });
};

export async function getAllStages(
  client: IDeskproClient,
): Promise<PipedriveAPIResponse<IPipedriveStage[]>> {
  return await pipedriveGet({ client, endpoint: `stages?api_token=__api_key__` });
};

// Source: https://developers.pipedrive.com/docs/api/v1/Stages#getStages
export async function getPipelineStages(
  client: IDeskproClient,
  pipelineId: number
): Promise<PipedriveAPIResponse<IPipedriveStage[]>> {
  return await pipedriveGet({ client, endpoint: `stages?pipeline_id=${pipelineId}&api_token=__api_key__` });
};

export async function getAllContacts(
  client: IDeskproClient,
): Promise<PipedriveAPIResponse<IPipedriveContact[]>> {
  return await pipedriveGet({ client, endpoint: `persons?api_token=__api_key__` });
};

export async function getAllDeals(
  client: IDeskproClient,
): Promise<PipedriveAPIResponse<IPipedriveDeal[]>> {
  return await pipedriveGet({ client, endpoint: `deals?api_token=__api_key__` });
};

export async function getImage(client: IDeskproClient, imageId: string) {
  return proxyFetch(client)
    .then((fetch) => fetch(`https://__instance_domain__.pipedrive.com/v1/files/${imageId}/download?api_token=__api_key__`))
    .then((res) => res.blob());
};