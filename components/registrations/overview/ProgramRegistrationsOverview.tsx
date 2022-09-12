import type { ReactElement } from 'react';
import ProgramRegistrations from 'components/registrations/overview/ProgramRegistrations';
import { useRegistrationProgramItem } from 'components/registrations/overview/RegistrationsOverviewContext';
import type Registration from 'lib/registrations/Registration';

interface Props {
    programType: string;
    programId: number;
    registrations: Array<Registration>;
}

const ProgramRegistrationsOverview = ({ programId, programType, registrations }: Props): ReactElement => {

    const programItem = useRegistrationProgramItem(programType, programId);

    if (programItem === null) {
        return (
            <div className="mb-5 bg-red text-white p-3">
                {programType} mit ID {programId} nicht gefunden!
            </div>
        );
    }

    return <ProgramRegistrations registrations={registrations} programItem={programItem} />;
};

export default ProgramRegistrationsOverview;
