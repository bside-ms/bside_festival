import type { ReactElement } from 'react';
import { useMostLoyalRegisteredNames, useRegistrationsOverviewContext, useUniqueRegisteredNames } from 'components/registrations/overview/RegistrationsOverviewContext';

const RegistrationsHeadline = (): ReactElement => {

    const { allRegistrations } = useRegistrationsOverviewContext();
    const uniqueRegisteredNames = useUniqueRegisteredNames();

    const mostLoyalRegisteredNames = useMostLoyalRegisteredNames();

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
