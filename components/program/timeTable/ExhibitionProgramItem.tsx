import type { ReactElement } from 'react';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type Exhibition from 'lib/strapi/typings/Exhibition';
import useStrapiCollectionTypeUrl from 'lib/strapi/useStrapiCollectionTypeUrl';

interface Props {
    exhibition: Exhibition;
}

const TimeTableProgramItem = ({ exhibition }: Props): ReactElement => {

    const [name, collectionType, applicationType] = getDetailsFromProgramItem(exhibition);

    const strapiUrl = useStrapiCollectionTypeUrl(collectionType, exhibition.id);

    const backgroundColor = useApplicationTypeColor(applicationType);

    return (
        <div
            className="p-1 rounded-md drop-shadow-md h-[50px]"
            style={{ backgroundColor: `${backgroundColor}CC` }}
        >
            <a
                href={strapiUrl}
                target="_blank"
            >
                Ganztägig - {name}
            </a>
        </div>
    );
};

export default TimeTableProgramItem;
