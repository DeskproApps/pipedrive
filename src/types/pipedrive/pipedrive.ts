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


export type PipedriveV2Response<T> = {
  success: boolean
  data: T
  additional_data?: {
    next_cursor?: null | string
  }
};