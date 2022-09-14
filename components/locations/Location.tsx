import styles from './Location.module.scss';

import { useMemo } from 'react';
import { faWheelchair } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip } from '@mui/material';
import Link from 'next/link';
import type { ReactElement } from 'react';
import EditorJsBlocks from 'components/editorJs/EditorJsBlocks';
import LocationEditLink from 'components/locations/LocationEditLink';
import useEditorJsData from 'lib/editorJs/useEditorJsData';
import getImageUrl from 'lib/strapi/getImageUrl';
import getLinksData from 'lib/strapi/getLinksData';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';

interface Props {
    locationGroup: LocationGroup;
}

const Location = ({ locationGroup }: Props): ReactElement => {

    const location = locationGroup.attributes.locations.data[0]!;

    const { Description: groupDescription, accessibilityHint: groupAccessibilityHint, Links: groupLinks, Name: groupName } = locationGroup.attributes;
    const { Description, accessibilityHint, Address, Links, Name, publishedAt } = location.attributes;

    const descriptionData = useEditorJsData(groupDescription || Description);

    const linksData = getLinksData(groupLinks.length > 0 ? groupLinks : Links);

    const imageUrl = getImageUrl(location.attributes.Images, false, 'medium', locationGroup.id < 600);

    const usedAccessibilityHint = useMemo(() => {

        if (groupAccessibilityHint !== null && groupAccessibilityHint !== '') {
            return groupAccessibilityHint;
        }

        if (accessibilityHint === null || accessibilityHint === '') {
            return null;
        }

        return accessibilityHint;
    }, [accessibilityHint, groupAccessibilityHint]);

    return (
        <div key={location.id} className={`space-y-3 relative z-50 ${styles.location ?? ''}`}>
            <div className="flex flex-col md:space-x-4 md:flex-row z-50 relative bg-white">
                {imageUrl === null ? (
                    <div
                        className="h-[0] w-full md:min-h-[150px] md:shrink-0 md:w-1/3"
                    />
                ) : (
                    <div
                        className="h-[300px] md:h-auto w-full md:min-h-[250px] md:shrink-0 md:w-1/3 bg-center bg-cover"
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

                    <LocationEditLink locationId={location.id} />

                    <div className="font-display">
                        {groupName || Name}
                    </div>

                    {Address !== null && (
                        <div className="text-gray-700">
                            {Address}
                        </div>
                    )}

                    {usedAccessibilityHint !== null && (
                        <div className="text-orange-600">
                            <FontAwesomeIcon icon={faWheelchair} /> {accessibilityHint}
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
