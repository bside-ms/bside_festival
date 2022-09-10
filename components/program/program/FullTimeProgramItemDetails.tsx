import { Chip } from '@mui/material';
import type { ReactElement } from 'react';
import TruncateMarkup from 'react-truncate-markup';
import ArtistDescription from 'components/artist/ArtistDescription';
import { usePreferredLocationName } from 'lib/context/LocationGroupsContext';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';

interface Props {
    programItem: FullTimeProgramItem;
}

const FullTimeProgramItemDetails = ({ programItem }: Props): ReactElement => {

    const { artist } = getDetailsFromProgramItem(programItem);

    const preferredLocationName = usePreferredLocationName(programItem.attributes.location.data);

    return (
        <div className="leading-5 mt-2">
            <TruncateMarkup lines={1}>
                <div>
                    Ganztägig{preferredLocationName !== null && (
                        <>, {preferredLocationName}</>
                    )}
                </div>
            </TruncateMarkup>

            {programItem.attributes.publishedAt === null && (
                <div className="mt-2">
                    <Chip
                        className="mb-3"
                        label="Unveröffentlicht"
                        variant="outlined"
                        color="warning"
                    />
                </div>
            )}

            {programItem.attributes.publishedAt !== null && artist !== null && (
                <>
                    <div className="mt-2 hidden md:block">
                        <ArtistDescription artist={artist} truncateAfterLines={5} />
                    </div>
                    <div className="mt-2 md:hidden">
                        <ArtistDescription artist={artist} truncateAfterLines={2} />
                    </div>
                </>
            )}
        </div>
    );
};

export default FullTimeProgramItemDetails;
