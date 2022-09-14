import type { ReactElement } from 'react';
import ProgramRegistrations from 'components/registrations/overview/ProgramRegistrations';
import { useRegistrationsForProgram } from 'components/registrations/overview/RegistrationsOverviewContext';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
}

const RegistrationsProgramWrapper = ({ programItem }: Props): ReactElement => {

    const registrationsForProgram = useRegistrationsForProgram(programItem);

    return (
        <ProgramRegistrations
            key={programItem.id}
            registrations={registrationsForProgram}
            programItem={programItem}
        />
    );
};

export default RegistrationsProgramWrapper;
