export interface IPipedriveUser {
  emails: string[];
  primary_email: string;
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
