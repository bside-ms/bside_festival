import VolunteerForm from '@/components/volunteers/volunteerForm/VolunteerForm';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    return (
        <div className="relative mx-auto min-h-screen w-full max-w-7xl pt-5 pb-3">
            <div className="text-center font-display text-6xl uppercase">Mithelfen</div>

            <VolunteerForm />
        </div>
    );
};
