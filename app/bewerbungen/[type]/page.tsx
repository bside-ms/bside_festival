import ApplicationForm from '@/components/applications/applicationForm/ApplicationForm';
import prismaClient from '@/lib/common/prismaClient';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import urlPathTypes from '@/lib/participants/urlPathTypes';
import { Prisma, Type } from '@prisma/client';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';
import SortOrder = Prisma.SortOrder;
import GenreCreateManyInput = Prisma.GenreCreateManyInput;

const getAllConcertGenres = async () => {
    const allGenres = await prismaClient.genre.findMany({ where: { type: Type.Concert }, orderBy: { name: SortOrder.asc } });

    if (allGenres.length !== 0) {
        return allGenres;
    }

    const initialGenres = ['Indie', 'Rock', 'Pop', 'Hip-Hop', 'Elektro', 'Techno', 'Jazz', 'Funk', 'Singer-Songwriter', 'Metal'];

    await prismaClient.genre.createMany({ data: initialGenres.map<GenreCreateManyInput>((name) => ({ name, type: Type.Concert })) });

    return prismaClient.genre.findMany({ where: { type: Type.Concert }, orderBy: { name: SortOrder.asc } });
};

const getAllDiskJockeyGenres = async () => {
    const allGenres = await prismaClient.genre.findMany({ where: { type: Type.DiskJockey }, orderBy: { name: SortOrder.asc } });

    if (allGenres.length !== 0) {
        return allGenres;
    }

    const initialGenres = [
        'Techno',
        'House',
        'Elektro',
        'Drum and Bass',
        'Dubstep',
        'Trance',
        'Hip-Hop',
        'Disco',
        'Ambient',
        'Experimental',
    ];

    await prismaClient.genre.createMany({ data: initialGenres.map<GenreCreateManyInput>((name) => ({ name, type: Type.DiskJockey })) });

    return prismaClient.genre.findMany({ where: { type: Type.DiskJockey }, orderBy: { name: SortOrder.asc } });
};

export default async ({ params }: { params: Promise<{ type: string }> }): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const { type } = await params;

    const chosenType = urlPathTypes[type] ?? null;

    if (chosenType === null) {
        redirect('/bewerbungen');
    }

    const allConcertGenres = await getAllConcertGenres();
    const allDiskJockeyGenres = await getAllDiskJockeyGenres();

    return (
        <div className="relative min-h-screen w-full">
            <div className="relative z-10 mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-8">
                <ApplicationForm chosenType={chosenType} allConcertGenres={allConcertGenres} allDiskJockeyGenres={allDiskJockeyGenres} />
            </div>
        </div>
    );
};
