import type ApplicationData from 'lib/application-form/ApplicationData';

export default interface AllApplicationsResponse {
    success: boolean;
    applications: Array<ApplicationData>;
}
