import type { JWT } from 'next-auth/jwt/types';
import type ExtendedJWT from 'lib/next-auth/ExtendedJWT';

const isExtendedJwt = (token: JWT): token is ExtendedJWT => 'keycloakGroups' in token;

export default isExtendedJwt;
