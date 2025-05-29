export interface Settings {
    api_key?: string;
    instance_domain?: string;
    client_id?: string,
    use_advanced_connect?: boolean,
    use_access_token?: boolean,
}

export type TicketData = {
    ticket: {
        id: string,
        subject: string,
        permalinkUrl: string,
    },
}