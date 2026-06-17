import type ExtendedJWT from '@/lib/next-auth/ExtendedJWT';
import type ExtendedSession from '@/lib/next-auth/ExtendedSession';
import isExtendedJwt from '@/lib/next-auth/isExtendedJwt';
import isExtendedKeycloakProfile from '@/lib/next-auth/isExtendedKeycloakProfile';
import type { AuthOptions } from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

const authOptions: AuthOptions = {
    providers: [
        Keycloak({
            issuer: process.env.KEYCLOAK_ISSUER_URL,
            clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
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
                    if (typeof token.sub === 'string') {
                        extendedSession.user.id = token.sub;
                    }

                    extendedSession.user.keycloakGroups = token.keycloakGroups;
                }

                return extendedSession;
            }

            return session;
        },
    },
};

export default authOptions;
