import type ExtendedSession from '@/lib/next-auth/ExtendedSession';
import getUserSession from '@/lib/next-auth/getUserSession';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';

export type ActionUser = NonNullable<ExtendedSession['user']>;

export const requireLoggedInUser = async (): Promise<ActionUser> => {
    const user = await getUserSession();

    if (user === null) {
        throw new Error('Diese Aktion erfordert eine Anmeldung.');
    }

    return user;
};

export const requireDataPrivacyUser = async (): Promise<ActionUser> => {
    const user = await requireLoggedInUser();

    if (!user.keycloakGroups?.includes(dataPrivacyGroup)) {
        throw new Error('Diese Aktion erfordert Datenschutz-Berechtigungen.');
    }

    return user;
};
