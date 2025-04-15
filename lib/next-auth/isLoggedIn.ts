import getUserSession from 'lib/next-auth/getUserSession';

const isLoggedIn = async (): Promise<boolean> => (await getUserSession()) !== null;

export default isLoggedIn;
