import type { Session } from 'next-auth';

export default interface ExtendedSession extends Session {
    user?: {
        name?: string | null;
        email?: string | null;
        image?: string | null;

        // Extended part
        keycloakGroups?: Array<string>;
    };
}
