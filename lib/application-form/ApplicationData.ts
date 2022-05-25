import type ApplicationType from 'lib/application-form/ApplicationType';

export default interface ApplicationData {
    id: number;
    type: ApplicationType;
    createdAt: Date;
    data: Record<string, string>;
}
