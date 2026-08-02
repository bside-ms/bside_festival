'use server';

import { requireLoggedInUser } from '@/lib/actions/actionAuth';
import getKeycloakUsers, { type KeycloakUser } from '@/lib/keycloak/getKeycloakUsers';
import getAssignedOrganizerUserIds from '@/lib/participants/getAssignedOrganizerUserIds';

export const getOrganizerAssignmentOptions = async (): Promise<{
    availableOrganizers: Array<KeycloakUser>;
    responsibleOrganizerIds: Array<string>;
}> => {
    await requireLoggedInUser();

    const [availableOrganizers, responsibleOrganizerIds] = await Promise.all([getKeycloakUsers(), getAssignedOrganizerUserIds()]);

    return { availableOrganizers, responsibleOrganizerIds };
};
