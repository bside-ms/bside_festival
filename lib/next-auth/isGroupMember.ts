import getUserSession from '@/lib/next-auth/getUserSession';

const isGroupMember = async (group: string): Promise<boolean> => (await getUserSession())?.keycloakGroups?.includes(group) ?? false;

export default isGroupMember;
