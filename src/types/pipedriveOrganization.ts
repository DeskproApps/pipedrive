export interface IPipedriveOrganization {
    id:                         number;
    company_id:                 number;
    owner_id:                   OwnerID;
    name:                       string;
    open_deals_count:           number;
    related_open_deals_count:   number;
    closed_deals_count:         number;
    related_closed_deals_count: number;
    email_messages_count:       number;
    people_count:               number;
    activities_count:           number;
    done_activities_count:      number;
    undone_activities_count:    number;
    files_count:                number;
    notes_count:                number;
    followers_count:            number;
    won_deals_count:            number;
    related_won_deals_count:    number;
    lost_deals_count:           number;
    related_lost_deals_count:   number;
    active_flag:                boolean;
    category_id:                null;
    picture_id:                 null;
    country_code:               null;
    first_char:                 string;
    update_time:                string;
    delete_time:                null;
    add_time:                   string;
    visible_to:                 string;
    next_activity_date:         null;
    next_activity_time:         null;
    next_activity_id:           null;
    last_activity_id:           null;
    last_activity_date:         null;
    label:                      null;
    address:                    null;
    address_subpremise:         null;
    address_street_number:      null;
    address_route:              null;
    address_sublocality:        null;
    address_locality:           null;
    address_admin_area_level_1: null;
    address_admin_area_level_2: null;
    address_country:            null;
    address_postal_code:        null;
    address_formatted_address:  null;
    owner_name:                 string;
    cc_email:                   string;
}

export interface OwnerID {
    id:          number;
    name:        string;
    email:       string;
    has_pic:     number;
    pic_hash:    null;
    active_flag: boolean;
    value?:      number;
}

export interface RelatedObjects {
    user: User;
}

export interface User {
    "15119309": OwnerID;
}
