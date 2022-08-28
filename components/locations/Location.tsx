import styles from './Location.module.scss';

import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip } from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import EditorJsBlocks from 'components/editorJs/EditorJsBlocks';
import { useLocationGroupOfLocation } from 'lib/context/LocationGroupsContext';
import useEditorJsData from 'lib/editorJs/useEditorJsData';
import isGroupMember from 'lib/next-auth/isGroupMember';
import getImageUrl from 'lib/strapi/getImageUrl';
import getLinksData from 'lib/strapi/getLinksData';
import getStrapiCollectionTypeUrl from 'lib/strapi/getStrapiCollectionTypeUrl';
import Location from 'lib/strapi/typings/Location';

interface Props {
    location: Location;
}

const Location = ({ location }: Props): ReactElement => {

    const { data: session } = useSession();
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const groupOfLocation = useLocationGroupOfLocation(location);

    const { Description, Address, Links, Name, publishedAt } = location.attributes;

    const descriptionData = useEditorJsData(Description);

    const linksData = getLinksData(Links);

    const imageUrl = getImageUrl(location, false, 'medium');

    const strapiUrl = getStrapiCollectionTypeUrl('location', location.id);

    return (
        <div key={location.id} className={`space-y-3 relative z-50 ${styles.location ?? ''}`}>
            <div className="flex flex-col md:space-x-4 md:flex-row z-50 relative bg-white">
                {imageUrl === null ? (
                    <div
                        className="h-[0] w-full md:min-h-[500px] md:shrink-0 md:w-1/3"
                    />
                ) : (
                    <div
                        className="h-[400px] w-full md:min-h-[500px] md:shrink-0 md:w-1/3 bg-center bg-cover"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                )}

                <div className="p-4 space-y-3 z-50 relative">
                    {publishedAt === null && (
                        <Chip
                            label="Unveröffentlicht"
                            variant="outlined"
                        />
                    )}

                    {isInFestivalGroup && (
                        <div>
                            <Link href={strapiUrl}>
                                <a className="text-blue-500 hover:text-blue-700" target="_blank">
                                    <FontAwesomeIcon icon={faWrench} /> Bearbeiten
                                </a>
                            </Link>
                        </div>
                    )}

                    <div className="font-display">
                        {groupOfLocation !== null && (
                            <div className="uppercase text-xs font-sans">
                                {groupOfLocation.attributes.Name}
                            </div>
                        )}

                        {Name}
                    </div>

                    {Address !== null && (
                        <div className="text-gray-700">
                            {Address}
                        </div>
                    )}

                    {descriptionData !== null && (
                        <div>
                            <EditorJsBlocks blocks={descriptionData.blocks} />
                        </div>
                    )}

                    {linksData.length > 0 && (
                        <div className="space-x-4">
                            {linksData.map(link => (
                                <Link href={link.url} key={link.url}>
                                    <a className="text-blue-500 hover:text-blue-700 space-x-1 align-middle leading-4" target="_blank">
                                        <FontAwesomeIcon icon={link.icon} /> <span>{link.label}</span>
                                    </a>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Location;
