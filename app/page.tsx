import HomePage from '@/components/home/HomePage';
import getHomeNowPlaying from '@/lib/public/getHomeNowPlaying';
import { isVolunteerSignupOpen } from '@/lib/volunteers/volunteerSchedule';
import type { ReactElement } from 'react';

export const dynamic = 'force-dynamic';

export default async (): Promise<ReactElement> => {
    const nowPlaying = await getHomeNowPlaying();

    return <HomePage nowPlaying={nowPlaying} showVolunteerSignup={isVolunteerSignupOpen()} />;
};
