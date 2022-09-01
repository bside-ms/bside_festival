import { Chip } from '@mui/material';
import type { ReactElement } from 'react';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';

interface Props {
    programItem: FullTimeProgramItem;
}

const FullTimeProgramItemDetails = ({ programItem }: Props): ReactElement => {

    const location = programItem.attributes.location.data?.attributes.Name ?? null;

    return (
        <div className="leading-5 mt-2">
            <div className="flex flex-row gap-3">
                <div>
                    <div>Ganztägig</div>

                    {location !== null && (
                        <div>{location}</div>
                    )}
                </div>

                {programItem.attributes.publishedAt === null && (
                    <div>
                        <Chip
                            className="mb-3"
                            label="Unveröffentlicht"
                            variant="outlined"
                            color="warning"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullTimeProgramItemDetails;
