import prismaClient from '@/lib/common/prismaClient';
import { uniqBy } from 'lodash';

export interface KeycloakUser {
    id: string;
    name: string;
}

interface KeycloakAdminUser {
    enabled?: boolean;
    firstName?: string;
    id: string;
}

const getIssuerUrl = (): string | null => process.env.KEYCLOAK_ISSUER_URL ?? process.env.KEYCLOAK_ISSUER ?? null;

const getAdminUsersUrl = (issuerUrl: string): string => {
    const url = new URL(issuerUrl);
    const [basePath, realmPath] = url.pathname.split('/realms/');
    const realm = realmPath?.split('/')[0] ?? '';

    url.pathname = `${basePath}/admin/realms/${realm}/users`;
    url.search = new URLSearchParams({ enabled: 'true', max: '500' }).toString();

    return url.toString();
};

const getFallbackUsers = async (): Promise<Array<KeycloakUser>> => {
    const entries = await prismaClient.changeLogEntry.findMany({
        orderBy: { createdAt: 'desc' },
        select: { actorEmail: true, actorName: true },
    });

    return uniqBy(
        entries
            .map(({ actorEmail, actorName }) => ({
                id: actorEmail ?? actorName ?? '',
                name: actorName ?? actorEmail ?? '',
            }))
            .filter(({ id, name }) => id.trim().length > 0 && name.trim().length > 0),
        ({ id }) => id,
    );
};

const getFirstName = ({ firstName }: KeycloakAdminUser): string | null => {
    const name = firstName?.trim() ?? '';

    return name.length > 0 ? name : null;
};

const getKeycloakUsers = async (): Promise<Array<KeycloakUser>> => {
    const issuerUrl = getIssuerUrl();
    const clientId = process.env.KEYCLOAK_CLIENT_ID;
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

    if (issuerUrl === null || clientId === undefined || clientSecret === undefined) {
        console.warn('Keycloak user lookup skipped: missing issuer URL, client ID, or client secret.');
        return getFallbackUsers();
    }

    try {
        const tokenResponse = await fetch(`${issuerUrl}/protocol/openid-connect/token`, {
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials',
            }),
            cache: 'no-store',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST',
        });

        if (!tokenResponse.ok) {
            console.warn(`Keycloak user lookup token request failed with status ${tokenResponse.status}.`);
            return getFallbackUsers();
        }

        const token = (await tokenResponse.json()) as { access_token?: string };

        if (token.access_token === undefined) {
            console.warn('Keycloak user lookup token response did not contain an access token.');
            return getFallbackUsers();
        }

        const usersResponse = await fetch(getAdminUsersUrl(issuerUrl), {
            cache: 'no-store',
            headers: { Authorization: `Bearer ${token.access_token}` },
        });

        if (!usersResponse.ok) {
            console.warn(`Keycloak user lookup users request failed with status ${usersResponse.status}.`);
            return getFallbackUsers();
        }

        const users = (await usersResponse.json()) as Array<KeycloakAdminUser>;

        return users
            .flatMap((user) => {
                if (user.enabled === false) {
                    return [];
                }

                const name = getFirstName(user);

                if (name === null) {
                    return [];
                }

                return [{ id: user.id, name }];
            })
            .sort((a, b) => a.name.localeCompare(b.name, 'de-DE'));
    } catch (error) {
        console.warn('Keycloak user lookup failed unexpectedly.', error);
        return getFallbackUsers();
    }
};

export default getKeycloakUsers;
