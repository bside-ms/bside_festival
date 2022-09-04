import { Chip } from '@mui/material';
import type { ReactElement } from 'react';
import ArtistDescription from 'components/artist/ArtistDescription';
import formatDate from 'lib/common/formatDate';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem;
}

const ProgramItemDetails = ({ programItem }: Props): ReactElement => {

    const { artist } = getDetailsFromProgramItem(programItem);

    const beginFromItem = new Date(programItem.attributes.Begin);
    const endFromItem = new Date(programItem.attributes.End);

    const formattedBegin = formatDate(beginFromItem, 'HH:mm');
    const formattedEnd = formatDate(endFromItem, 'HH:mm');

    const location = programItem.attributes.location.data?.attributes.Name ?? null;

    return (
        <div className="leading-5 mt-2">
            <div className="flex flex-row">
                <div>{formattedBegin} - {formattedEnd}</div>

                {location !== null && (
                    <div>, {location}</div>
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

export default ProgramItemDetails;
