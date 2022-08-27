import type { ReactElement } from 'react';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import getStrapiCollectionTypeUrl from 'lib/strapi/getStrapiCollectionTypeUrl';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';

interface Props {
    fullTimeProgramItem: FullTimeProgramItem;
}

const TimeTableFullTimeProgramItem = ({ fullTimeProgramItem }: Props): ReactElement => {

    const { artistName, collectionType, applicationType } = getDetailsFromProgramItem(fullTimeProgramItem);

    const strapiUrl = getStrapiCollectionTypeUrl(collectionType, fullTimeProgramItem.id);

    const backgroundColor = useApplicationTypeColor(applicationType);

    return (
        <a
            className="p-1 rounded-md drop-shadow-md h-[50px] block"
            style={{ backgroundColor: `${backgroundColor}CC` }}
            href={strapiUrl}
            target="_blank"
        >
            Ganztägig - {artistName}
        </a>
    );
};

export default TimeTableFullTimeProgramItem;
