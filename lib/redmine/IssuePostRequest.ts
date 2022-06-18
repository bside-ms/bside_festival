export default interface IssuePostRequest {
    issue: {
        project_id: string | number;
        subject: string;
        description?: string;
        tracker_id?: string | number;
        status_id?: string | number;
        priority_id?: string | number;
        category_id?: string | number;
        start_date?: string | null;
    };
}
