import type { KeycloakProfile } from 'next-auth/providers/keycloak';

export default interface ExtendedKeycloakProfile extends KeycloakProfile {
    members?: Array<string>;
}
