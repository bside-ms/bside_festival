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

    const { Coordinates, Description, Address, Links, Name, publishedAt } = location.attributes;

    const descriptionData = useEditorJsData(Description);

    const linksData = getLinksData(Links);

    const locationInfo = Address ?? Coordinates ?? null;

    const strapiUrl = getStrapiCollectionTypeUrl('location', location.id);

    return (
        <div key={location.id} className="p-4 bg-gradient-to-b from-gray-200 to-gray-50 rounded space-y-3">
            <div className="flex space-x-4">
                <div className="flex flex-col space-y-3">
                    <div
                        className="rounded-full h-32 w-32 bg-center bg-cover"
                        style={{ backgroundImage: `url(${getImageUrl(location)!})` }}
                    />

                    {publishedAt === null && (
                        <Chip
                            label="Unveröffentlicht"
                            variant="outlined"
                        />
                    )}

                    {isInFestivalGroup && (
                        <div className="text-center">
                            <Link href={strapiUrl}>
                                <a className="text-blue-500 hover:text-blue-700" target="_blank">
                                    <FontAwesomeIcon icon={faWrench} /> Bearbeiten
                                </a>
                            </Link>
                        </div>
                    )}
                </div>

                <div className="space-y-3">

                    <div className="font-display">
                        {groupOfLocation !== null && (
                            <div className="uppercase text-xs font-sans">
                                {groupOfLocation.attributes.Name}
                            </div>
                        )}

                        {Name}
                    </div>

                    {locationInfo !== null && (
                        <div className="text-gray-700">
                            {locationInfo}
                        </div>
                    )}

                    {descriptionData !== null && (
                        <div>
                            <EditorJsBlocks blocks={descriptionData.blocks} />
                        </div>
                    )}

                    <div className="space-x-4">
                        {linksData.map(link => (
                            <Link href={link.url} key={link.url}>
                                <a className="text-blue-500 hover:text-blue-700 space-x-1 align-middle leading-4" target="_blank">
                                    <FontAwesomeIcon icon={link.icon} /> <span>{link.label}</span>
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Location;
