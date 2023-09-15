import { addDays } from 'date-fns';

export const pinnedParticipantsCookieName = 'pinnedParticipants';

const readCookie = (key: string): string | null => {
    try {
        const cookieRegex = new RegExp(`${key}=([^;]+)`);
        const match = cookieRegex.exec(document.cookie);

        if (match === null || match[1] === undefined) {
            return null;
        }

        return match[1];
    } catch {
        return null;
    }
};

const setCookie = (key: string, value: string, daysToExpired = 30): void => {
    try {
        const expiresDate = addDays(new Date(), daysToExpired);
        document.cookie = `${key}=${value};expires=${expiresDate.toUTCString()};path=/`;
    } catch {
        // We don't mind then..
    }
};

export { readCookie, setCookie };
