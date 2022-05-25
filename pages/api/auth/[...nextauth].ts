import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';

const issuer = process.env.KEYCLOAK_ISSUER_URL;
const clientId = process.env.KEYCLOAK_CLIENT_ID;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

if (issuer === undefined || clientId === undefined || clientSecret === undefined) {
    throw new Error('Make sure to provide Keycloak environment variables');
}

const nextAuth = NextAuth({
    providers: [
        Keycloak({
            issuer: process.env.KEYCLOAK_ISSUER_URL,
            clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
        }),
    ],
});

export default nextAuth;
