import type { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import type ExtendedSession from 'lib/next-auth/ExtendedSession';
import isExtendedSession from 'lib/next-auth/isExtendedSession';

const getUserSession = async ({ req, res }: GetServerSidePropsContext): Promise<NonNullable<ExtendedSession['user']> | null> => {

    const session = await getServerSession(req, res, authOptions);

    if (session === null || !isExtendedSession(session) || session.user === undefined) {
        return null;
    }

    return session.user;
};

export default getUserSession;
