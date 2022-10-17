export interface IPipedriveNote {
  id: number;
  user_id: number;
  deal_id: null;
  person_id: number;
  org_id: null;
  lead_id: null;
  content: string;
  add_time: string;
  update_time: string;
  active_flag: boolean;
  pinned_to_deal_flag: boolean;
  pinned_to_person_flag: boolean;
  pinned_to_organization_flag: boolean;
  pinned_to_lead_flag: boolean;
  last_update_user_id: null;
  organization: null;
  person: Person;
  deal: null;
  lead: null;
  user: User;
}

export interface Person {
  name: string;
}

export interface User {
  email: string;
  name: string;
  icon_url: null;
  is_you: boolean;
}
