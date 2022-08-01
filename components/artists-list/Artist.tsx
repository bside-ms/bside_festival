import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip } from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import EditorJsBlocks from 'components/editorJs/EditorJsBlocks';
import useEditorJsData from 'lib/editorJs/useEditorJsData';
import isGroupMember from 'lib/next-auth/isGroupMember';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';
import type StrapiCollectionType from 'lib/strapi/typings/StrapiCollectionType';
import useLinksData from 'lib/strapi/useLinksData';
import useStrapiCollectionTypeUrl from 'lib/strapi/useStrapiCollectionTypeUrl';

interface Props {
    artist: ArtistModel;
    strapiCollectionType: StrapiCollectionType;
}

const getThumbnailUrl = (artist: ArtistModel): string => {

    if (artist.attributes.Images.data === null || artist.attributes.Images.data[0]?.attributes === undefined) {
        return 'https://place-puppy.com/300x300';
    }

    const imageAttributes = artist.attributes.Images.data[0]?.attributes;

    /* eslint-disable @typescript-eslint/no-unnecessary-condition */
    return (
        imageAttributes.formats.thumbnail?.url ??
        imageAttributes.formats.small?.url ??
        imageAttributes.formats.medium?.url ??
        imageAttributes.formats.large?.url ??
        imageAttributes.url
    );
};

const Artist = ({ artist, strapiCollectionType }: Props): ReactElement => {

    const { data: session } = useSession();
    const isInFestivalGroup = isGroupMember('/kreise/festival/mitglieder', session);

    const descriptionData = useEditorJsData(artist.attributes.Description);

    const linksData = useLinksData(artist.attributes.Links);

    const strapiUrl = useStrapiCollectionTypeUrl(strapiCollectionType, artist.id);

    return (
        <div key={artist.id} className="p-4 bg-gradient-to-b from-gray-200 to-gray-50 rounded space-y-3">
            <div className="flex space-x-4">
                <div className="flex flex-col space-y-3">
                    <div
                        className="rounded-full h-32 w-32 bg-center bg-cover"
                        style={{ backgroundImage: `url(${getThumbnailUrl(artist)})` }}
                    />

                    {artist.attributes.publishedAt === null && (
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
                        {artist.attributes.Name}
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

export default Artist;
