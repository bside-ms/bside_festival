import type { Session } from 'next-auth';

const isGroupMember = (group: string, session: Session | null | undefined): boolean => {

    return true;

    // if (session === null || session === undefined) {
    //     return false;
    // }
    //
    // if (!isExtendedSession(session) || session.user === undefined) {
    //     return false;
    // }
    //
    // if (session.user.keycloakGroups === undefined) {
    //     return false;
    // }
    //
    // return session.user.keycloakGroups.includes(group);
};

export default isGroupMember;
