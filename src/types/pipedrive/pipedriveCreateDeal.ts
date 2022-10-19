export interface IPipedriveCreateDeal {
    title: string;
    value: string;
    currency: string;
    user_id: string;
    person_id: string;
    org_id: string;
    pipeline_id: string;
    expected_close_date: string;
    submit: string | null;
}