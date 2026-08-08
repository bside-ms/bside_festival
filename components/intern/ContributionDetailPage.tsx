'use client';

import { ApplicationNameForm } from '@/components/applications/applicationCuration/ApplicationNameAndDescriptionForm';
import ContributionDetails from '@/components/intern/ContributionDetails';
import Badge from '@/components/participants/details/Badge';
import { buildContributionBackHref } from '@/lib/intern/slotplanSearchParams';
import statusLabels from '@/lib/participants/status/statusLabels';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { SerializableProgramLocation } from '@/typings/SerializableProgramLocation';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import type { Genre, Link, Zipcode } from '@prisma/client';
import NextLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
    genres: Array<Genre>;
    links: Array<Link>;
    programLocations: Array<SerializableProgramLocation>;
    scheduleEntries: Array<SerializableScheduleEntry>;
    zipcodes: Array<Zipcode>;
}

const ContributionDetailPage = ({ application, genres, links, programLocations, scheduleEntries, zipcodes }: Props): ReactElement => {
    const searchParams = useSearchParams();
    const { href: backHref, label: backLabel } = buildContributionBackHref(searchParams);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3">
                <NextLink href={backHref} className="w-fit text-sm font-bold text-black underline-offset-2 hover:underline">
                    {backLabel}
                </NextLink>

                <div className="flex flex-wrap items-center gap-2">
                    <Badge label={typeLabels[application.type]} backgroundColor={typeColors[application.type]} />
                    {genres.map(({ id, name }) => (
                        <Badge key={id} label={name} backgroundColor="#fcb8b8" />
                    ))}
                    <Badge label={statusLabels[application.status]} backgroundColor="lightgray" />
                </div>

                <ApplicationNameForm application={application} />
            </div>

            <div className="overflow-hidden rounded-md border border-black bg-white shadow-sm">
                <ContributionDetails
                    application={application}
                    genres={genres}
                    links={links}
                    programLocations={programLocations}
                    scheduleEntries={scheduleEntries}
                    zipcodes={zipcodes}
                />
            </div>
        </div>
    );
};

export default ContributionDetailPage;
