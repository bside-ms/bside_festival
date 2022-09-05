import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import isGroupMember from 'lib/next-auth/isGroupMember';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import getStrapiCollectionTypeUrl from 'lib/strapi/getStrapiCollectionTypeUrl';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
}

const ArtistProgramEditButton = ({ programItem }: Props): ReactElement | null => {

    const { data: session } = useSession();
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    if (!isInFestivalGroup) {
        return null;
    }

    const { collectionType } = getDetailsFromProgramItem(programItem);

    getStrapiCollectionTypeUrl(collectionType, programItem.id);

    const strapiUrl = getStrapiCollectionTypeUrl(collectionType, programItem.id);

    return (
        <div>
            <Link href={strapiUrl}>
                <a className="text-blue-500 hover:text-blue-700" target="_blank">
                    <FontAwesomeIcon icon={faWrench} /> Programmpunkt bearbeiten
                </a>
            </Link>
        </div>
    );
};

export default ArtistProgramEditButton;
