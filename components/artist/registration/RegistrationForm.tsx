import type { ReactElement } from 'react';
import RegistrationFormContents from 'components/artist/registration/RegistrationFormContents';
import { RegistrationFormContextProvider } from 'components/artist/registration/RegistrationFormContext';
import RegistrationFormThemeProvider from 'components/artist/registration/RegistrationFormThemeProvider';
import RegistrationFormWrapper from 'components/artist/registration/RegistrationFormWrapper';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import type RegistrationsCount from 'lib/registrations/RegistrationsCount';
import useRegistrationsCount from 'lib/registrations/useRegistrationsCount';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type LocationGroup from 'lib/strapi/typings/LocationGroup';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';
import type Registration from 'lib/strapi/typings/Registration';

interface Props {
    registration: Registration;
    programItem: ProgramItem | FullTimeProgramItem;
    groupOfLocation: LocationGroup | null;
    handleCloseClick: () => void;
}

const RegistrationForm = ({ registration, programItem, groupOfLocation, handleCloseClick }: Props): ReactElement => {

    const { collectionType: programType } = getDetailsFromProgramItem(programItem);

    const swrRegistrationsCountResponse = useRegistrationsCount(programType, programItem.id);

    return (
        <div>
            <SwrResponseWrapper<RegistrationsCount> response={swrRegistrationsCountResponse}>
                {(registrationsCount): ReactElement => (
                    <RegistrationFormThemeProvider>
                        <RegistrationFormContextProvider
                            registration={registration}
                            registrationsCount={registrationsCount.count}
                            programItem={programItem}
                            groupOfLocation={groupOfLocation}
                            handleCloseRegistration={handleCloseClick}
                        >
                            <RegistrationFormWrapper>
                                <RegistrationFormContents />
                            </RegistrationFormWrapper>
                        </RegistrationFormContextProvider>
                    </RegistrationFormThemeProvider>
                )}
            </SwrResponseWrapper>
        </div>
    );
};

export default RegistrationForm;
