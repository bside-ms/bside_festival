import type { JWT } from 'next-auth/jwt/types';

export default interface ExtendedJWT extends JWT {
    keycloakGroups?: Array<string>;
}
