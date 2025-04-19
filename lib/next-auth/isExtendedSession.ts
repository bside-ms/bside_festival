import type ExtendedSession from 'lib/next-auth/ExtendedSession';
import type { Session } from 'next-auth';

const isExtendedSession = (session: Session): session is ExtendedSession => session.user !== undefined && 'keycloakGroups' in session.user;

export default isExtendedSession;
