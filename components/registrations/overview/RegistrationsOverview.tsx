import type { ReactElement } from 'react';
import { useProgramItemsWithNeedToRegister } from 'components/registrations/overview/RegistrationsOverviewContext';
import RegistrationsProgramWrapper from 'components/registrations/overview/RegistrationsProgramWrapper';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';

const RegistrationsOverview = (): ReactElement => {

    const programItemsWithNeedToRegister = useProgramItemsWithNeedToRegister();

    return (
        <div>
            {programItemsWithNeedToRegister.map(programItem => {
                const { collectionType } = getDetailsFromProgramItem(programItem);

                return (
                    <RegistrationsProgramWrapper
                        key={`${programItem.id}_${collectionType}`}
                        programItem={programItem}
                    />
                );
            })}
        </div>
    );
};

export default RegistrationsOverview;
