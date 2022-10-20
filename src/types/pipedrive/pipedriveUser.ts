export interface IPipedriveUser {
    id:                    number;
    name:                  string;
    email:                 string;
    phone:                 string;
    lang:                  number;
    locale:                string;
    timezone_name:         string;
    timezone_offset:       string;
    default_currency:      string;
    icon_url:              null;
    active_flag:           boolean;
    is_admin:              number;
    role_id:               number;
    created:               string;
    modified:              string;
    last_login:            string;
    signup_flow_variation: null;
    has_created_company:   boolean;
    is_you:                boolean;
    access:                Access[];
}

export interface Access {
    app:               string;
    admin:             boolean;
    permission_set_id: string;
}
