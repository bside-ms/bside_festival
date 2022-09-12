import type { ReactElement } from 'react';
import ProgramRegistrationsOverview from 'components/registrations/overview/ProgramRegistrationsOverview';
import { useRegistrationsGroupedByProgram } from 'components/registrations/overview/RegistrationsOverviewContext';

const RegistrationsOverview = (): ReactElement => {

    const registrationsGroupedByProgram = useRegistrationsGroupedByProgram();

    return (
        <div>
            {registrationsGroupedByProgram.map(({ programId, programType, registrations }) => (
                <ProgramRegistrationsOverview
                    key={`${programType}${programId}`}
                    programType={programType}
                    programId={programId}
                    registrations={registrations}
                />
            ))}
        </div>
    );
};

export default RegistrationsOverview;
