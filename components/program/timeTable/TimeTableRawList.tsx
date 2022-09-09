import { useMemo } from 'react';
import type { ReactElement } from 'react';
import type ApplicationType from 'lib/application-form/ApplicationType';
import getTitleForApplicationType from 'lib/application-form/getTitleForApplicationType';
import formatDate from 'lib/common/formatDate';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type Location from 'lib/strapi/typings/Location';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItems: Array<ProgramItem>;
    fullTimeProgramItems: Array<FullTimeProgramItem>;
}

interface ProgramAtLocation {
    location: Location;
    programItems: Map<ApplicationType, Array<ProgramItem>>;
    fullTimeProgramItems: Map<ApplicationType, Array<FullTimeProgramItem>>;
}

const TimeTableRawList = ({ programItems, fullTimeProgramItems }: Props): ReactElement => {

    const allProgramItemsAtLocations = useMemo(() => {

        const programItemsAtLocations = programItems.reduce(
            (currentProgramAtLocations, programItem) => {

                const { applicationType } = getDetailsFromProgramItem(programItem);

                const location = programItem.attributes.location.data;

                if (location === null) {
                    return currentProgramAtLocations;
                }

                if (!currentProgramAtLocations.has(location.id)) {
                    currentProgramAtLocations.set(
                        location.id,
                        {
                            location,
                            programItems: new Map<ApplicationType, Array<ProgramItem>>(),
                            fullTimeProgramItems: new Map<ApplicationType, Array<FullTimeProgramItem>>(),
                        }
                    );
                }

                const programItemsMap = currentProgramAtLocations.get(location.id)!.programItems;

                if (!programItemsMap.has(applicationType)) {
                    programItemsMap.set(applicationType, []);
                }

                programItemsMap.get(applicationType)!.push(programItem);

                return currentProgramAtLocations;
            },
            new Map<number, ProgramAtLocation>()
        );

        fullTimeProgramItems.forEach(fullTimeProgramItem => {

            const { applicationType } = getDetailsFromProgramItem(fullTimeProgramItem);

            const location = fullTimeProgramItem.attributes.location.data;

            if (location === null) {
                return;
            }

            if (!programItemsAtLocations.has(location.id)) {
                programItemsAtLocations.set(
                    location.id,
                    {
                        location,
                        programItems: new Map<ApplicationType, Array<ProgramItem>>(),
                        fullTimeProgramItems: new Map<ApplicationType, Array<FullTimeProgramItem>>(),
                    }
                );
            }

            const fullTimeProgramItemsMap = programItemsAtLocations.get(location.id)!.fullTimeProgramItems;

            if (!fullTimeProgramItemsMap.has(applicationType)) {
                fullTimeProgramItemsMap.set(applicationType, []);
            }

            fullTimeProgramItemsMap.get(applicationType)!.push(fullTimeProgramItem);
        });

        return programItemsAtLocations;

    }, [fullTimeProgramItems, programItems]);

    return (
        <div className="mt-7">
            <ul className="list-disc list-inside">
                {Array.from(allProgramItemsAtLocations.entries()).map(([locationId, programAtLocation]) => (
                    <li key={locationId}>
                        {programAtLocation.location.attributes.Name}

                        <ul className="pl-5 list-disc list-inside">
                            {Array.from(programAtLocation.programItems.entries()).map(([applicationType, _programItems]) => {

                                const title = getTitleForApplicationType(applicationType);

                                return (
                                    <li key={title}>
                                        {title}

                                        <ul className="pl-5 list-disc list-inside">
                                            {_programItems.map(programItem => {

                                                const { artistName } = getDetailsFromProgramItem(programItem);

                                                const dateFromItem = formatDate(programItem.attributes.Begin, 'dd.MM.');
                                                const beginFromItem = formatDate(programItem.attributes.Begin, 'HH:mm');
                                                const endFromItem = formatDate(programItem.attributes.End, 'HH:mm');

                                                return (
                                                    <li key={programItem.id}>
                                                        {dateFromItem}, {beginFromItem} - {endFromItem} - <strong>{artistName}</strong>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                );
                            })}

                            {Array.from(programAtLocation.fullTimeProgramItems.entries()).map(([applicationType, _fullTimeProgramItems]) => {

                                const title = getTitleForApplicationType(applicationType);

                                return (
                                    <li key={title}>
                                        {title}

                                        <ul className="pl-5 list-disc list-inside">
                                            {_fullTimeProgramItems.map(fullTimeProgramItem => {

                                                const { artistName } = getDetailsFromProgramItem(fullTimeProgramItem);

                                                const beginFromItem = formatDate(fullTimeProgramItem.attributes.Begin, 'dd.MM.');
                                                const endFromItem = formatDate(fullTimeProgramItem.attributes.End, 'dd.MM.');

                                                return (
                                                    <li key={fullTimeProgramItem.id}>
                                                        {beginFromItem} - {endFromItem} (ganztägig) - <strong>{artistName}</strong>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TimeTableRawList;
