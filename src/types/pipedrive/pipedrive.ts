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