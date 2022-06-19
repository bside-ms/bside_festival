import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip } from '@mui/material';
import Link from 'next/link';
import type { ReactElement } from 'react';
import EditorJsBlocks from 'components/editorJs/EditorJsBlocks';
import useEditorJsData from 'lib/editorJs/useEditorJsData';
import ConcertArtist from 'lib/strapi/ConcertArtist';
import useLinksData from 'lib/strapi/useLinksData';

interface Props {
    concertArtist: ConcertArtist;
}

const getThumbnailUrl = (concertArtist: ConcertArtist): string => {

    if (concertArtist.attributes.Images.data === null || concertArtist.attributes.Images.data[0]?.attributes === undefined) {
        return 'https://place-puppy.com/300x300';
    }

    const imageAttributes = concertArtist.attributes.Images.data[0]?.attributes;

    /* eslint-disable @typescript-eslint/no-unnecessary-condition */
    return (
        imageAttributes.formats.thumbnail?.url ??
        imageAttributes.formats.small?.url ??
        imageAttributes.formats.medium?.url ??
        imageAttributes.formats.large?.url ??
        imageAttributes.url
    );
};

const ConcertArtist = ({ concertArtist }: Props): ReactElement => {

    const descriptionData = useEditorJsData(concertArtist.attributes.Description);

    const linksData = useLinksData(concertArtist.attributes.Links);

    return (
        <div key={concertArtist.id} className="p-4 bg-gradient-to-b from-gray-200 to-gray-50 rounded space-y-3">
            <div className="flex space-x-4">
                <div className="flex flex-col space-y-3">
                    <div
                        className="rounded-full h-32 w-32 bg-center bg-cover"
                        style={{ backgroundImage: `url(${getThumbnailUrl(concertArtist)})` }}
                    />

                    {concertArtist.attributes.publishedAt === null && (
                        <Chip
                            label="Unveröffentlicht"
                            variant="outlined"
                        />
                    )}
                </div>

                <div className="space-y-3">
                    <div className="font-display">
                        {concertArtist.attributes.Name}
                    </div>

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

export default ConcertArtist;
