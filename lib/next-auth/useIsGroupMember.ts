import type { Session } from 'next-auth';
import isExtendedSession from 'lib/next-auth/isExtendedSession';

const useIsGroupMember = (group: string, session: Session | null | undefined): boolean => {

    if (session === null || session === undefined) {
        return false;
    }

    if (!isExtendedSession(session) || session.user === undefined) {
        return false;
    }

    if (session.user.keycloakGroups === undefined) {
        return false;
    }

    return session.user.keycloakGroups.includes(group);
};

export default useIsGroupMember;
