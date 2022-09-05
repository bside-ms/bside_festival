import type { ReactElement } from 'react';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
}

const ArtistProgramRegistrationHint = ({ programItem }: Props): ReactElement | null => {

    const { registration } = getDetailsFromProgramItem(programItem);

    if (registration === null) {
        return null;
    }

    return (
        <div className="mt-2 text-sm md:text-base text-pink-600">
            Für diesen Programmpunkt ist eine Anmeldung erforderlich.
            Die Infos dazu folgen zeitnah an dieser Stelle!
        </div>
    );
};

export default ArtistProgramRegistrationHint;
