import type { ReactElement } from 'react';
import ApplicationForm from 'components/applications/applicationForm/ApplicationForm';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import urlPathTypes from 'lib/participants/urlPathTypes';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prismaClient from 'lib/common/prismaClient';

const getAllConcertGenres = async () => {
    const allGenres = await prismaClient.concertGenre.findMany({ orderBy: { genre: 'asc' } });

    if (allGenres.length !== 0) {
        return allGenres;
    }

    const initialGenres = ['Indie', 'Rock', 'Pop', 'Hip-Hop', 'Elektro', 'Techno', 'Jazz', 'Funk', 'Singer-Songwriter', 'Metal'];

    await prismaClient.concertGenre.createMany({ data: initialGenres.map((genre) => ({ genre })) });

    return prismaClient.concertGenre.findMany({ orderBy: { genre: 'asc' } });
};

const getAllDiskJockeyGenres = async () => {
    const allGenres = await prismaClient.diskJockeyGenre.findMany({ orderBy: { genre: 'asc' } });

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

    await prismaClient.diskJockeyGenre.createMany({ data: initialGenres.map((genre) => ({ genre })) });

    return prismaClient.diskJockeyGenre.findMany({ orderBy: { genre: 'asc' } });
};

export default async ({ params }: { params: Promise<{ type: string }> }): Promise<ReactElement> => {
    const { type } = await params;

    const chosenType = urlPathTypes[type] ?? null;

    if (chosenType === null) {
        redirect('/bewerbungen');
    }

    const allConcertGenres = await getAllConcertGenres();
    const allDiskJockeyGenres = await getAllDiskJockeyGenres();

    return (
        <div>
            <div className="relative min-h-screen w-full">
                <div className="relative z-10 mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-8">
                    <Link href="/" className="flex items-center gap-3 text-red-600">
                        <div className="pt-1 text-2xl md:pt-2 md:text-3xl">B-Side Festival 2025</div>
                    </Link>

                    <ApplicationForm
                        chosenType={chosenType}
                        allConcertGenres={allConcertGenres}
                        allDiskJockeyGenres={allDiskJockeyGenres}
                    />
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
