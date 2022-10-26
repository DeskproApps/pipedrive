export interface IPipedriveCreateActivity {
  due_date: string;
  due_time: string;
  duration: string;
  deal_id: number;
  person_id: number;
  org_id: number;
  note: string;
  location: string;
  activity_subject: string;
  public_description: string;
  subject: string;
  type: string;
  user_id: number;
  participants: string[];
  busy_flag: boolean;
  attendees: string[];
  done: number;
  submit: string;
}
