import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

export default interface RegistrationAddRequest {
    fullName: string;
    mailAddress: string;
    programItem: ProgramItem | FullTimeProgramItem;
    groupOfLocation: LocationGroup | null;
}
