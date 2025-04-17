export interface IPipedriveActivity {
    id: number;
    company_id: number;
    user_id: number;
    done: boolean;
    type: string;
    reference_type: null;
    reference_id: null;
    conference_meeting_client: null;
    conference_meeting_url: null;
    due_date: string;
    due_time: string;
    duration: string;
    busy_flag: null;
    add_time: string;
    is_deleted: boolean;
    marked_as_done_time: string;
    last_notification_time: null;
    last_notification_user_id: null;
    notification_language_id: null;
    subject: string;
    public_description: null;
    calendar_sync_include_context: null;
    location: null;
    org_id: null;
    person_id: number;
    deal_id: null;
    lead_id: null;
    project_id: null;
    active_flag: boolean;
    update_time: string;
    update_user_id: null;
    source_timezone: null;
    rec_rule: null;
    rec_rule_extension: null;
    rec_master_activity_id: null;
    conference_meeting_id: null;
    original_start_time: null;
    note: string;
    created_by_user_id: number;
    location_subpremise: null;
    location_street_number: null;
    location_route: null;
    location_sublocality: null;
    location_locality: null;
    location_admin_area_level_1: null;
    location_admin_area_level_2: null;
    location_country: null;
    location_postal_code: null;
    location_formatted_address: null;
    attendees: null;
    participants: Participant[];
    series: null;
    is_recurring: null;
    org_name: null;
    person_name: string;
    deal_title: null;
    lead_title: null;
    project_title: null;
    owner_name: string;
    person_dropbox_bcc: string;
    deal_dropbox_bcc: null;
    assigned_to_user_id: number;
    type_name: string;
    lead: null;
}

export interface Participant {
    person_id: number;
    primary_flag: boolean;
}

export interface RelatedObjects {
    user: User;
    person: Person;
}

export interface Person {
    "4": The4;
}

export interface The4 {
    id: number;
    name: string;
    email: Email[];
    phone: Email[];
    owner_id: number;
}

export interface Email {
    label: string;
    value: string;
    primary: boolean;
}

export interface User {
    "15119309": The15119309;
}

export interface The15119309 {
    id: number;
    name: string;
    email: string;
    has_pic: number;
    pic_hash: null;
    active_flag: boolean;
}
