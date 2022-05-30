import type { Profile } from 'next-auth';
import type ExtendedKeycloakProfile from 'lib/next-auth/ExtendedKeycloakProfile';

const isExtendedKeycloakProfile = (profile?: Profile): profile is ExtendedKeycloakProfile => (
    profile !== undefined && 'members' in profile
);

export default isExtendedKeycloakProfile;
