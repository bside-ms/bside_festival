import { isSameDay } from 'date-fns';
import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationType from 'lib/application-form/ApplicationType';
import formatDate from 'lib/common/formatDate';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    locationGroup: LocationGroup;
    programItems: Array<ProgramItem | FullTimeProgramItem>;
}

const ProgramItemTimeInfo = ({ programItem }: { programItem: ProgramItem | FullTimeProgramItem }): ReactElement | null => {

    const { applicationType } = getDetailsFromProgramItem(programItem);

    const beginDate = new Date(programItem.attributes.Begin);
    const endDate = new Date(programItem.attributes.End);

    switch (applicationType) {
        case ApplicationType.konzert:
        case ApplicationType.performance:
        case ApplicationType.workshop:
        case ApplicationType.familienprogramm:
        case ApplicationType.lesung:
            return (
                <div>
                    {formatDate(beginDate, 'EEE')}, {formatDate(beginDate, 'HH:mm')} - {formatDate(endDate, 'HH:mm')} Uhr
                </div>
            );

        case ApplicationType.ausstellung:
        case ApplicationType.infostand:
        case ApplicationType.essensstand: {
            if (isSameDay(beginDate, endDate)) {
                return (
                    <div>
                        {formatDate(beginDate, 'EEEE')}
                    </div>
                );
            }

            return (
                <div>
                    {formatDate(beginDate, 'EEEE')} - {formatDate(endDate, 'EEEE')}
                </div>
            );
        }

        case ApplicationType.nachbarschaft:
        case ApplicationType.anderes:
            return null;
    }
};

const LocationProgram = ({ locationGroup, programItems }: Props): ReactElement | null => {

    const locationIds = locationGroup.attributes.locations.data.reduce(
        (currentLocationId, location) => {
            currentLocationId.push(location.id);
            return currentLocationId;
        },
        new Array<number>()
    );

    const programItemsAtLocation = programItems.filter(
        programItem => (
            programItem.attributes.location.data !== null &&
            locationIds.includes(programItem.attributes.location.data.id)
        )
    );

    if (programItemsAtLocation.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="space-y-2">
                {programItemsAtLocation.map(programItem => {
                    const { artistId, artistName, applicationType, collectionType } = getDetailsFromProgramItem(programItem);

                    return (
                        <div key={`${programItem.id}_${collectionType}`}>
                            <div className="text-sm">
                                <ProgramItemTimeInfo programItem={programItem} />
                            </div>

                            <Link href={`/artists/${applicationType}/${artistId ?? ''}`}>
                                <a className="text-blue-500 hover:text-blue-700 cursor-pointer leading-4">
                                    <div>{artistName}</div>
                                </a>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LocationProgram;
