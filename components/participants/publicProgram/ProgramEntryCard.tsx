import { getPublicProgramSection } from '@/lib/participants/publicProgramSections';
import createPublicObjectUrl from '@/lib/upload/createPublicObjectUrl';
import type PublicProgramEntry from '@/typings/PublicProgramEntry';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';

interface Props {
    participant: PublicProgramEntry;
}

const ProgramEntryCard = ({ participant }: Props): ReactElement => {
    const { color } = getPublicProgramSection(participant.type);
    const imageUrl =
        participant.imageFileName === null || participant.imageFileName === '' ? null : createPublicObjectUrl(participant.imageFileName);

    return (
        <Link
            href={`/programm/${participant.id}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-[#2C2E83] no-underline outline-offset-4 focus-visible:outline-4 focus-visible:outline-white"
            aria-label={`${participant.name} ansehen`}
        >
            {imageUrl === null ? (
                <div className="absolute inset-0" style={{ backgroundColor: color }} />
            ) : (
                <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                />
            )}

            <div className="absolute inset-x-0 top-0 h-2/3 bg-linear-to-b from-black/90 via-black/45 to-transparent" />
            <div className="absolute inset-x-0 top-0 p-4 sm:p-5">
                <div className="line-clamp-2 text-2xl leading-[0.94] font-black text-white drop-shadow-sm sm:text-3xl">
                    {participant.name}
                </div>
            </div>

            {participant.status === 'Canceled' && (
                <div className="absolute inset-x-0 bottom-0 bg-[#2C2E83]/95 px-3 py-2 text-center text-sm font-black text-white">
                    Fällt leider aus
                </div>
            )}
        </Link>
    );
};

export default ProgramEntryCard;
