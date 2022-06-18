import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip } from '@mui/material';
import Link from 'next/link';
import type { ReactElement } from 'react';
import EditorJsBlocks from 'components/editorJs/EditorJsBlocks';
import useEditorJsData from 'lib/editorJs/useEditorJsData';
import Location from 'lib/strapi/Location';
import useLinksData from 'lib/strapi/useLinksData';

interface Props {
    location: Location;
}

const Location = ({ location }: Props): ReactElement => {

    const { Coordinates, Description, Address, Links, Name, publishedAt } = location.attributes;

    const descriptionData = useEditorJsData(Description);

    const linksData = useLinksData(Links);

    const locationInfo = Address ?? Coordinates ?? null;

    return (
        <div key={location.id} className="p-4 bg-gradient-to-b from-gray-200 to-gray-50 rounded space-y-3">
            <div className="flex space-x-4">
                <div className="space-y-3">
                    <div className="font-display">
                        {Name}
                    </div>

                    {publishedAt === null && (
                        <Chip
                            label="Unveröffentlicht"
                            variant="outlined"
                        />
                    )}

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
