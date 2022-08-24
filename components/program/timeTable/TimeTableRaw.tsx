import { useCallback, useState } from 'react';
import { isBefore } from 'date-fns';
import type { ReactElement } from 'react';
import ApplicationType from 'lib/application-form/ApplicationType';
import formatDate from 'lib/common/formatDate';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type Concert from 'lib/strapi/typings/Concert';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import type FamilyProgram from 'lib/strapi/typings/FamilyProgram';
import type Food from 'lib/strapi/typings/Food';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type InformationBooth from 'lib/strapi/typings/InformationBooth';
import type Performance from 'lib/strapi/typings/Performance';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type Reading from 'lib/strapi/typings/Reading';
import type Workshop from 'lib/strapi/typings/Workshop';

interface Props {
    concerts: Array<Concert>;
    workshops: Array<Workshop>;
    readings: Array<Reading>;
    performances: Array<Performance>;
    familyPrograms: Array<FamilyProgram>;
    exhibitions: Array<Exhibition>;
    foods: Array<Food>;
    informationBooths: Array<InformationBooth>;
}

const TimeTableRawRow = (
    { name, applicationType, programItem }: { name: string | null, applicationType: ApplicationType, programItem: ProgramItem }
): ReactElement | null => {

    const date = formatDate(new Date(programItem.attributes.Begin), 'dd.MM.yyyy');
    const begin = formatDate(new Date(programItem.attributes.Begin), 'HH:mm');
    const end = formatDate(new Date(programItem.attributes.End), 'HH:mm');
    const location = programItem.attributes.location.data?.attributes.Name ?? null;

    if (name === null || location === null) {
        return null;
    }

    return (
        <tr key={`${applicationType}_${programItem.id}`}>
            <td className="px-4 border py-1">{date}</td>
            <td className="px-4 border py-1">{begin}</td>
            <td className="px-4 border py-1">{end}</td>
            <td className="px-4 border py-1">{applicationType}</td>
            <td className="px-4 border py-1">{name}</td>
            <td className="px-4 border py-1">{location}</td>
        </tr>
    );
};

const TimeTableRawFullTimeRow = (
    { name, applicationType, programItem }: { name: string | null, applicationType: ApplicationType, programItem: FullTimeProgramItem }
): ReactElement | null => {

    const begin = formatDate(new Date(programItem.attributes.Begin), 'dd.MM.yyyy');
    const end = formatDate(new Date(programItem.attributes.End), 'dd.MM.yyyy');
    const location = programItem.attributes.location.data?.attributes.Name ?? null;

    if (name === null || location === null) {
        return null;
    }

    return (
        <tr>
            <td className="border px-4 py-1">{begin}</td>
            <td className="border px-4 py-1">{end}</td>
            <td className="border px-4 py-1">{applicationType === ApplicationType.workshop ? 'infostand' : applicationType}</td>
            <td className="border px-4 py-1">{name}</td>
            <td className="border px-4 py-1">{location}</td>
        </tr>
    );
};

const TimeTableRaw = ({
    concerts,
    workshops,
    readings,
    performances,
    familyPrograms,
    exhibitions,
    foods,
    informationBooths,
}: Props): ReactElement => {

    const [showRawTimeTable, setShowRawTimeTable] = useState(false);
    const handleToggle = useCallback(() => setShowRawTimeTable(prevState => !prevState), []);

    const allProgramItems = [...concerts, ...workshops, ...performances, ...readings, ...familyPrograms].sort(
        (itemA, itemB) => isBefore(new Date(itemA.attributes.Begin), new Date(itemB.attributes.Begin)) ? -1 : 1
    );

    const allFullTimeProgramItems = [...exhibitions, ...foods, ...informationBooths].sort(
        (itemA, itemB) => isBefore(new Date(itemA.attributes.Begin), new Date(itemB.attributes.Begin)) ? -1 : 1
    );

    return (
        <div className="mb-5 text-lg">
            <div className="mb-3">
                <button onClick={handleToggle} className="bg-pink-500 cursor-pointer font-bold py-2 px-4 rounded text-white hover:bg-pink-600">
                    Slotplan als Liste ein-/ausblenden
                </button>
            </div>

            {showRawTimeTable && (
                <div className="space-y-5">
                    <div>
                        <div className="font-bold text-2xl mb-1">Programmpunkte</div>
                        <table>
                            <thead>
                                <tr className="sticky top-0">
                                    <th className="bg-pink-200 border text-left px-4 py-1">Datum</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Begin</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Ende</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Typ</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Name</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Ort</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProgramItems.map(programItem => {

                                    const { artistName, applicationType } = getDetailsFromProgramItem(programItem);

                                    return (
                                        <TimeTableRawRow
                                            key={`${applicationType}_${programItem.id}`}
                                            name={artistName}
                                            applicationType={applicationType}
                                            programItem={programItem}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <div className="font-bold text-2xl mb-1">Ganztägige Programmpunkte</div>
                        <table>
                            <thead>
                                <tr className="sticky top-0">
                                    <th className="bg-pink-200 border text-left px-4 py-1">Begin</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Ende</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Typ</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Name</th>
                                    <th className="bg-pink-200 border text-left px-4 py-1">Ort</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allFullTimeProgramItems.map(programItem => {

                                    const { artistName, applicationType } = getDetailsFromProgramItem(programItem);

                                    return (
                                        <TimeTableRawFullTimeRow
                                            key={`${applicationType}_${programItem.id}`}
                                            name={artistName}
                                            applicationType={applicationType}
                                            programItem={programItem}
                                        />
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeTableRaw;
