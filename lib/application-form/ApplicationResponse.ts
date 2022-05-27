import type ApplicationData from 'lib/application-form/ApplicationData';

export default interface ApplicationResponse {
    success: boolean;
    application: ApplicationData;
}
