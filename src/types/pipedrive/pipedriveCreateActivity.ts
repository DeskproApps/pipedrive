export interface IPipedriveCreateActivity {
  due_date: string;
  due_time: string;
  duration: string;
  deal_id: string;
  person_id: string;
  org_id: string;
  note: string;
  location: string;
  activity_subject: string;
  public_description: string;
  subject: string;
  type: string;
  user_id: string;
  participants: string[];
  busy_flag: boolean;
  attendees: string[];
  done: number;
  submit: string;
}
