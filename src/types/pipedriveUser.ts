export interface IPipedriveUser {
  email: string;
  name: string;
  access: IAccess[];
  active_flag: boolean;
  id: string;
}

interface IAccess {
  app: string;
  permission_set_id?: string;
  admin?: boolean;
}
