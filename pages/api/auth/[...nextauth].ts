import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

export default NextAuth({
    providers: [
        Keycloak({
            issuer: process.env.KEYCLOAK_ISSUER_URL,
            clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
        signIn: async ({ user, account, profile, email, credentials }) => {
            console.log('signIn', { user, account, profile, email, credentials });

            return true;
        },
        redirect: async ({ url, baseUrl }) => {
            console.log('redirect', { url, baseUrl });

            return baseUrl;
        },
        session: async ({ session, token, user }) => {
            console.log('session', { session, token, user });

            return session;
        },
        jwt: ({ token, user, account, profile, isNewUser }) => {

            console.log('jwt', { token, user, account, profile, isNewUser });

            return token;
        },
    },
});
