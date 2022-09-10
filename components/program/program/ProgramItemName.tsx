import type { ReactElement } from 'react';
import TruncateMarkup from 'react-truncate-markup';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
}

const ProgramItemName = ({ programItem }: Props): ReactElement => {

    const { artistName } = getDetailsFromProgramItem(programItem);

    return (
        <div className="font-display text-base break-all md:break-normal md:text-2xl">
            <TruncateMarkup lines={2}>
                <div>{artistName}</div>
            </TruncateMarkup>
        </div>
    );
};

export default ProgramItemName;
