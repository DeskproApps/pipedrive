export interface IPipedriveContact {
  id: number;
  company_id: number;
  owner_id: OwnerID;
  org_id: number;
  name: string;
  first_name: string;
  last_name: string;
  open_deals_count: number;
  related_open_deals_count: number;
  closed_deals_count: number;
  related_closed_deals_count: number;
  participant_open_deals_count: number;
  participant_closed_deals_count: number;
  email_messages_count: number;
  activities_count: number;
  done_activities_count: number;
  undone_activities_count: number;
  files_count: number;
  notes_count: number;
  followers_count: number;
  won_deals_count: number;
  related_won_deals_count: number;
  lost_deals_count: number;
  related_lost_deals_count: number;
  active_flag: boolean;
  phone: Email[];
  email: Email[];
  first_char: string;
  update_time: string;
  delete_time: null;
  add_time: string;
  visible_to: string;
  picture_id: null;
  next_activity_date: null;
  next_activity_time: null;
  next_activity_id: null;
  last_activity_id: null;
  last_activity_date: null;
  last_incoming_mail_time: null;
  last_outgoing_mail_time: null;
  label: null;
  org_name: null;
  cc_email: string;
  primary_email: string;
  owner_name: string;
}

export interface Email {
  label: string;
  value: string;
  primary: boolean;
}

export interface OwnerID {
  id: number;
  name: string;
  email: string;
  has_pic: number;
  pic_hash: null;
  active_flag: boolean;
  value: number;
}
