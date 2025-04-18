export type PipedriveAPIResponse<T> = {
  success: boolean;
  data: T;
};

export type PipedriveArray<T> = {
  items: [
    {
      item: T;
    }
  ];
};

export type PipedriveFilterOptions = {
  userId?: number
  ownerId?: number
  personId?: number // Contact ID
  limit?: number
  start?: number
  cursor?: string
}

export type PipedriveAdditionalData = {
  additional_data?: {
    next_cursor?: null | string
    pagination?: {
      start: number
      limit: number
      more_items_in_collection: boolean
      next_start?: number
    }
  }
}