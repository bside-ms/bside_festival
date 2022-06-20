import type IssuePostRequest from 'lib/redmine/IssuePostRequest';
import type IssuesPostResponse from 'lib/redmine/IssuesPostResponse';
import IssueStatus from 'lib/redmine/IssueStatus';
import type SearchResponse from 'lib/redmine/SearchResponse';

export default class RedmineTicketsService {

    private readonly redmineApiUrl = process.env.REDMINE_URL!;
    private readonly redmineApiKey = process.env.REDMINE_API_KEY!;

    public async createIssue(issueTitle: string, issueDescription: string): Promise<object> {

        const projectId = await this.findProjectId('konzert-bewerbungen');

        if (projectId === null) {
            throw new Error('Could not find project id');
        }

        const request: IssuePostRequest = {
            issue: {
                project_id: projectId,
                subject: issueTitle,
                description: issueDescription,
                status_id: IssueStatus['To-Do'],
                start_date: null,
            },
        };

        const url = new URL(this.redmineApiUrl);
        url.pathname = '/issues.json';

        const createResponse = await this.sendPostRequest<IssuesPostResponse>(url.toString(), JSON.stringify(request));

        return createResponse;
    }

    /**
     * This might go wrong since we just use the first project we find.
     */
    private async findProjectId(projectIdentifier: string): Promise<number | null> {

        const url = new URL(this.redmineApiUrl);
        url.pathname = '/search.json';

        const searchParams = new URLSearchParams();
        searchParams.append('q', projectIdentifier);
        searchParams.append('projects', '1');
        searchParams.append('limit', '1');

        url.search = searchParams.toString();

        const projects = await this.sendGetRequest<SearchResponse>(url.toString());

        if (projects.results[0] === undefined) {
            return null;
        }

        const project = projects.results[0];

        return project.id;
    }

    private async sendGetRequest<T = object>(url: string): Promise<T> {

        const response = await fetch(
            url.toString(),
            {
                headers: new Headers({
                    'X-Redmine-API-Key': this.redmineApiKey,
                }),
            }
        );

        return response.json() as unknown as T;
    }

    private async sendPostRequest<T = object>(url: string, requestBody: string): Promise<T> {

        const response = await fetch(
            url.toString(),
            {
                method: 'POST',
                headers: new Headers({
                    'X-Redmine-API-Key': this.redmineApiKey,
                    'Content-Type': 'application/json',
                }),
                body: requestBody,
            }
        );

        return response.json() as unknown as T;
    }
}
