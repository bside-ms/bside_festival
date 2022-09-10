import { useCallback, useState } from 'react';
import type { ReactElement } from 'react';
import RegistrationForm from 'components/artist/registration/RegistrationForm';
import { useLocationGroupOfLocation } from 'lib/context/LocationGroupsContext';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
}

const RegistrationWrapper = ({ programItem }: Props): ReactElement | null => {

    const [showRegistrationForm, setShowRegistrationForm] = useState(false);

    const location = programItem.attributes.location.data;
    const groupOfLocation = useLocationGroupOfLocation(location);

    const handleToggleFormClick = useCallback(
        () => setShowRegistrationForm(prevState => !prevState),
        []
    );

    const { registration } = getDetailsFromProgramItem(programItem);

    if (registration === null || !registration.registrationNecessary) {
        return null;
    }

    if (showRegistrationForm) {
        return (
            <RegistrationForm
                registration={registration}
                programItem={programItem}
                groupOfLocation={groupOfLocation}
                handleCloseClick={handleToggleFormClick}
            />
        );
    }

    const showFormLink = (
        <a className="underline cursor-pointer hover:text-pink-400" onClick={handleToggleFormClick}>
            Hier anmelden!
        </a>
    );

    return (
        <div className="mt-2 text-sm md:text-base text-pink-600">
            Für diesen Programmpunkt ist eine Anmeldung erforderlich. {showFormLink}
        </div>
    );
};

export default RegistrationWrapper;
