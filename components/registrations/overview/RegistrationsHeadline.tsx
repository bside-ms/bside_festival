import type { ReactElement } from 'react';
import { useRegistrationsOverviewContext, useUniqueRegisteredNames } from 'components/registrations/overview/RegistrationsOverviewContext';

const RegistrationsHeadline = (): ReactElement => {

    const { allRegistrations } = useRegistrationsOverviewContext();
    const uniqueRegisteredNames = useUniqueRegisteredNames();

    return (
        <div className="mb-3">
            <div className="text-xl font-bold">
                {allRegistrations.length} Anmeldungen
            </div>
            <div className="text-sm">
                Von {uniqueRegisteredNames.length} individuellen Besucher:innen
            </div>
        </div>
    );
};

export default RegistrationsHeadline;
