import VolunteerForm from '@/components/volunteers/volunteerForm/VolunteerForm';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    return (
        <div className="relative mx-auto min-h-screen w-full max-w-2xl px-5 pt-5 pb-12 md:px-8">
            <div className="mb-8 text-center font-display text-5xl uppercase sm:text-6xl">Mithelfen</div>

            <VolunteerForm />
        </div>
    );
};
