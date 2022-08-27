
import { Chip } from '@mui/material';
import type { ReactElement } from 'react';
import type { default as ArtistModel } from 'lib/strapi/typings/Artist';

interface Props {
    artist: ArtistModel;
}

const ArtistUnpublishedTag = ({ artist }: Props): ReactElement | null => {

    if (artist.attributes.publishedAt !== null) {
        return null;
    }

    return (
        <Chip
            label="Unveröffentlicht"
            variant="outlined"
        />
    );
};

export default ArtistUnpublishedTag;
