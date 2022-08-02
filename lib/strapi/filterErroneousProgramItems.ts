import { endOfDay, isAfter, isBefore, isSameMinute, startOfDay } from 'date-fns';
import getLabelFromCollectionType from 'lib/strapi/getLabelFromCollectionType';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';
import type ErroneousProgramItem from 'lib/strapi/typings/ErroneousProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';

const filterErroneousProgramItems = <T extends ProgramItem>(
    programItems: Array<T>,
    collectionType: StrapiCollectionType,
    allResponseData: AllProgramItems,
    erroneousProgramItems: Array<ErroneousProgramItem>
): Array<T> => {

    return programItems.filter(
        (programItem): boolean => {

            const itemBegin = new Date(programItem.attributes.Begin);
            const itemEnd = new Date(programItem.attributes.End);

            if (isBefore(itemEnd, itemBegin)) {
                erroneousProgramItems.push({
                    collectionType,
                    programItem,
                    reason: 'Das Ende liegt vor dem Beginn',
                });

                return false;
            }

            if (programItem.attributes.location.data === null) {
                erroneousProgramItems.push({
                    collectionType,
                    programItem,
                    reason: 'Der Ort fehlt',
                });

                return false;
            }

            const doesOverlap = [
                ...(allResponseData.concerts ?? []),
                ...(allResponseData.workshops ?? []),
                ...(allResponseData.performances ?? []),
                ...(allResponseData.readings ?? []),
            ].reduce<string | null>(
                (errorMessage, otherProgramItem): string | null => {

                    if (errorMessage !== null) {
                        return errorMessage;
                    }

                    if (otherProgramItem.id === programItem.id) {
                        return null;
                    }

                    if (programItem.attributes.location.data === null || otherProgramItem.attributes.location.data === null) {
                        return null;
                    }

                    if (programItem.attributes.location.data.id !== otherProgramItem.attributes.location.data.id) {
                        return null;
                    }

                    const otherItemBegin = new Date(otherProgramItem.attributes.Begin);
                    const otherItemEnd = new Date(otherProgramItem.attributes.End);

                    const label = getLabelFromCollectionType(collectionType);

                    if (isAfter(otherItemBegin, itemBegin) && isBefore(otherItemBegin, itemEnd)) {
                        return `Zeitraum überschneidet sich mit ${label} #${otherProgramItem.id} in derselben Location`;
                    }
                    if (isAfter(otherItemEnd, itemBegin) && isBefore(otherItemEnd, itemEnd)) {
                        return `Zeitraum überschneidet sich mit ${label} #${otherProgramItem.id} in derselben Location`;
                    }
                    if (isSameMinute(otherItemBegin, itemBegin) || isSameMinute(otherItemEnd, itemEnd)) {
                        return `Zeitraum überschneidet sich mit ${label} #${otherProgramItem.id} in derselben Location`;
                    }

                    return null;
                },
                null
            );
            if (doesOverlap !== null) {
                erroneousProgramItems.push({
                    collectionType,
                    programItem,
                    reason: doesOverlap,
                });

                return false;
            }

            const festivalBegin = startOfDay(new Date('2022-09-16'));
            const festivalEnd = endOfDay(new Date('2022-09-18'));
            if (isBefore(itemBegin, festivalBegin) || isAfter(itemBegin, festivalEnd) || isBefore(itemEnd, festivalBegin) || isAfter(itemEnd, festivalEnd)) {
                erroneousProgramItems.push({
                    collectionType,
                    programItem,
                    reason: 'Programmpunkt liegt außerhalb des Festival-Zeitraums',
                });

                return false;

            }

            return true;
        }
    );
};

export default filterErroneousProgramItems;
