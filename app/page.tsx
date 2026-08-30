import HomePage from '@/components/home/HomePage';
import { isVolunteerSignupOpen } from '@/lib/volunteers/volunteerSchedule';
import type { ReactElement } from 'react';

export const dynamic = 'force-dynamic';

export default async (): Promise<ReactElement> => {
    return <HomePage showVolunteerSignup={isVolunteerSignupOpen()} />;
};
