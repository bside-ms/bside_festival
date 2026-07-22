import SlotplanWorkspace from '@/components/intern/slotplan/SlotplanWorkspace';
import prismaClient from '@/lib/common/prismaClient';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import getAllParticipants from '@/lib/participants/getAllParticipants';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import getAllProgramLocationAreas from '@/lib/schedule/getAllProgramLocationAreas';
import getAllProgramLocations from '@/lib/schedule/getAllProgramLocations';
import getAllScheduleEntries from '@/lib/schedule/getAllScheduleEntries';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const participants = (await getAllParticipants(true, false)).map(serializeParticipant);
    const scheduleEntries = await getAllScheduleEntries();
    const programLocations = await getAllProgramLocations();
    const programLocationAreas = await getAllProgramLocationAreas();
    const participantGenres = await prismaClient.participantGenre.findMany();
    const allGenres = await prismaClient.genre.findMany();

    return (
        <div className="relative min-h-screen w-full px-2 pt-2 pb-3 md:px-4 md:pt-5 xl:px-6">
            <SlotplanWorkspace
                allGenres={allGenres}
                participantGenres={participantGenres}
                participants={participants}
                programLocations={programLocations}
                programLocationAreas={programLocationAreas}
                scheduleEntries={scheduleEntries}
            />
        </div>
    );
};
