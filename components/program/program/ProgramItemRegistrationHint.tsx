import type { ReactElement } from 'react';
import TruncateMarkup from 'react-truncate-markup';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
}

const ProgramItemDetails = ({ programItem }: Props): ReactElement | null => {

    const { registration } = getDetailsFromProgramItem(programItem);

    if (registration === null) {
        return null;
    }

    return (
        <div className="mt-2 text-sm text-pink-600">
            <TruncateMarkup>
                <div>Anmeldung erforderlich, Infos folgen!</div>
            </TruncateMarkup>
        </div>
    );
};

export default ProgramItemDetails;
