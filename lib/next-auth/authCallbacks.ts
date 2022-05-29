import type { CallbacksOptions } from 'next-auth';
import type ExtendedJWT from 'lib/next-auth/ExtendedJWT';
import type ExtendedSession from 'lib/next-auth/ExtendedSession';
import isExtendedJwt from 'lib/next-auth/isExtendedJwt';
import isExtendedKeycloakProfile from 'lib/next-auth/isExtendedKeycloakProfile';

const authCallbacks: Partial<CallbacksOptions> = {
    jwt: ({ token, profile }) => {

        if (isExtendedKeycloakProfile(profile)) {
            const extendedToken = token as ExtendedJWT;

            if (profile.members !== undefined) {
                extendedToken.keycloakGroups = profile.members;
            }

            if (profile.given_name !== '') {
                extendedToken.name = profile.given_name;
            }

            return extendedToken;
        }

        return token;
    },
    session: ({ session, token }) => {

        if (isExtendedJwt(token)) {
            const extendedSession = session as ExtendedSession;

            if (extendedSession.user !== undefined) {
                extendedSession.user.keycloakGroups = token.keycloakGroups;
            }

            return extendedSession;
        }

        return session;
    },
};

export default authCallbacks;
