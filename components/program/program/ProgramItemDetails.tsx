import { Chip } from '@mui/material';
import type { ReactElement } from 'react';
import TruncateMarkup from 'react-truncate-markup';
import ArtistDescription from 'components/artist/ArtistDescription';
import formatDate from 'lib/common/formatDate';
import { usePreferredLocationName } from 'lib/context/LocationGroupsContext';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem;
}

const ProgramItemDetails = ({ programItem }: Props): ReactElement => {

    const { artist } = getDetailsFromProgramItem(programItem);

    const formattedBegin = formatDate(programItem.attributes.Begin, 'HH:mm');
    const formattedEnd = formatDate(programItem.attributes.End, 'HH:mm');

    const preferredLocationName = usePreferredLocationName(programItem.attributes.location.data);

    return (
        <div className="leading-5 mt-2">
            <div className="md:hidden">
                <TruncateMarkup lines={1}>
                    <div>
                        {formattedBegin}{preferredLocationName !== null && (
                            <>, {preferredLocationName}</>
                        )}
                    </div>
                </TruncateMarkup>
            </div>
            <div className="hidden md:block">
                <div>
                    {formattedBegin} - {formattedEnd}
                </div>
                {preferredLocationName !== null && (
                    <div>{preferredLocationName}</div>
                )}
            </div>

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
                        <ArtistDescription artist={artist} truncateAfterLines={3} />
                    </div>
                    <div className="mt-2 md:hidden">
                        <ArtistDescription artist={artist} truncateAfterLines={2} />
                    </div>
                </>
            )}
        </div>
    );
};

export default ProgramItemDetails;
