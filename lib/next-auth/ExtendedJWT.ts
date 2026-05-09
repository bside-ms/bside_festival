import type { JWT } from 'next-auth/jwt';

export default interface ExtendedJWT extends JWT {
    keycloakGroups?: Array<string>;
}
