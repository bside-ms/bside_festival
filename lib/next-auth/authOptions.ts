import process from 'process';
import type { AuthOptions } from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import authCallbacks from 'lib/next-auth/authCallbacks';

const authOptions: AuthOptions = {
    providers: [
        Keycloak({
            issuer: process.env.KEYCLOAK_ISSUER_URL,
            clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: authCallbacks,
};

export default authOptions;
