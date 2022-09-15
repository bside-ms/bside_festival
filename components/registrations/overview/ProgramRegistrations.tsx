import { faBell, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addHours } from 'date-fns';
import { ceil } from 'lodash';
import Link from 'next/link';
import type { ReactElement } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import formatDate from 'lib/common/formatDate';
import type Registration from 'lib/registrations/Registration';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import getLabelFromCollectionType from 'lib/strapi/getLabelFromCollectionType';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
    registrations: Array<Registration>;
}

const ProgramTitle = ({ programItem }: { programItem: ProgramItem | FullTimeProgramItem }): ReactElement => {

    const { artistName, collectionType } = getDetailsFromProgramItem(programItem);

    return <div className="text-lg font-bold">{getLabelFromCollectionType(collectionType)}: {artistName}</div>;
};

const ProgramLink = ({ programItem }: { programItem: ProgramItem | FullTimeProgramItem }): ReactElement => {

    const { artistId, applicationType } = getDetailsFromProgramItem(programItem);

    return (
        <div className="">
            <Link href={`/artists/${applicationType}/${artistId ?? ''}`}>
                <a className="underline text-blue-600 cursor-pointer">
                    zum Programm-Punkt
                </a>
            </Link>
        </div>
    );
};

const DateAndTime = ({ programItem }: { programItem: ProgramItem | FullTimeProgramItem }): ReactElement => {

    const date = formatDate(programItem.attributes.Begin, 'EEEE, dd.MM.');
    const begin = formatDate(programItem.attributes.Begin, 'HH:mm');
    const end = formatDate(programItem.attributes.End, 'HH:mm');

    return <div>{date}, {begin} - {end}</div>;
};

const LocationName = ({ programItem }: { programItem: ProgramItem | FullTimeProgramItem }): ReactElement | null => {

    const locationName = programItem.attributes.location.data?.attributes.Name ?? null;

    return locationName === null ? null : <div>{locationName}</div>;
};

const ParticipantsCounts = (
    { registrations, programItem }: { registrations: Array<Registration>, programItem: ProgramItem | FullTimeProgramItem }
): ReactElement => {

    const { registration } = getDetailsFromProgramItem(programItem);

    const maxParticipants = registration?.maxParticipants ?? null;

    const LabeledIcon = ({ icon, label, color }: { icon: IconDefinition, label: string, color: string }): ReactElement => (
        <div className={`px-2 py-1 ${color}`}>
            <span className="pr-[4px]"><FontAwesomeIcon icon={icon} /></span> {label}
        </div>
    );

    if (maxParticipants === null) {
        return (
            <>
                <div className="bg-green-200 px-2 py-1 rounded">
                    Anmeldungen: {registrations.length} (keine Begrenzung)
                </div>
                {registrations.length === 0 && <LabeledIcon icon={faBell} label="ohne Anmeldungen" color="text-green-600" />}
            </>
        );
    }

    const occupancyRate = ceil(registrations.length * 100 / maxParticipants);

    let bgColor = 'bg-green-200';
    if (occupancyRate > 90) {
        bgColor = 'bg-red-500';
    } else if (occupancyRate > 80) {
        bgColor = 'bg-red-400';
    } else if (occupancyRate > 70) {
        bgColor = 'bg-orange-400';
    } else if (occupancyRate > 50) {
        bgColor = 'bg-orange-300';
    }

    return (
        <>
            <div className={`px-2 py-1 rounded ${bgColor}`}>
                Anmeldungen: {registrations.length} / {maxParticipants} - {occupancyRate}%
            </div>

            {occupancyRate === 100 && <LabeledIcon icon={faLock} label="ausgebucht" color="text-red-700" />}
            {occupancyRate === 0 && <LabeledIcon icon={faBell} label="ohne Anmeldungen" color="text-green-600" />}
        </>
    );
};

const RegisteredParticipant = ({ registration }: { registration: Registration }): ReactElement => {

    // Fucked up timezone again and don't feel like finding a solution..
    const registeredAt = addHours(new Date(registration.registeredAt), 2);

    const formattedRegisteredAt = formatDate(registeredAt, 'dd.MM., HH:mm');

    return (
        <li key={registration.id}>
            {registration.fullName} <span className="text-gray-500 text-sm">{formattedRegisteredAt}</span>
        </li>
    );
};

const ProgramRegistrations = ({ programItem, registrations }: Props): ReactElement => {

    return (
        <div className="mb-5 border border-pink-300 p-5">
            <div>
                <ProgramTitle programItem={programItem} />
                <ProgramLink programItem={programItem} />
                <DateAndTime programItem={programItem} />
                <LocationName programItem={programItem} />
                <div className="flex">
                    <ParticipantsCounts registrations={registrations} programItem={programItem} />
                </div>
            </div>

            <div>
                <ul className="list-disc list-inside pl-3">
                    {registrations.map(registration => (
                        <RegisteredParticipant key={registration.id} registration={registration} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProgramRegistrations;
