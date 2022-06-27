import type ApplicationType from 'lib/application-form/ApplicationType';

export default interface ApplicationData {
    id: number;
    type: ApplicationType;
    createdAt: string;
    data: Record<string, string>;
}
