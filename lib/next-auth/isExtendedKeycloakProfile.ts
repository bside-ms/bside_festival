import type ExtendedKeycloakProfile from 'lib/next-auth/ExtendedKeycloakProfile';
import type { Profile } from 'next-auth';

const isExtendedKeycloakProfile = (profile?: Profile): profile is ExtendedKeycloakProfile => profile !== undefined && 'members' in profile;

export default isExtendedKeycloakProfile;
