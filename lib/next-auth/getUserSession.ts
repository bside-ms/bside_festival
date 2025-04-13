import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import type ExtendedSession from 'lib/next-auth/ExtendedSession';
import isExtendedSession from 'lib/next-auth/isExtendedSession';

const getUserSession = async (): Promise<NonNullable<ExtendedSession['user']> | null> => {
    const session = await getServerSession(authOptions);

    if (session === null || !isExtendedSession(session) || session.user === undefined) {
        return null;
    }

    return session.user;
};

export default getUserSession;
