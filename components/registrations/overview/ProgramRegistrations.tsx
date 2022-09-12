import { addHours } from 'date-fns';
import { ceil } from 'lodash';
import type { ReactElement } from 'react';
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

    if (maxParticipants === null) {
        return (
            <div className="bg-green-200 px-2 py-1 rounded">
                Anmeldungen: {registrations.length} - keine Begrenzung
            </div>
        );
    }

    const occupancyRate = ceil(registrations.length * 100 / maxParticipants);

    let bgColor = 'bg-green-200';
    if (occupancyRate > 90) {
        bgColor = 'bg-red-500';
    } else if (occupancyRate > 80) {
        bgColor = 'bg-red-300';
    } else if (occupancyRate > 70) {
        bgColor = 'bg-orange-500';
    } else if (occupancyRate > 50) {
        bgColor = 'bg-orange-300';
    }

    return (
        <div className={`bg-green-200 px-2 py-1 rounded ${bgColor}`}>
            Anmeldungen: {registrations.length} / {maxParticipants} - {occupancyRate}%
        </div>
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
