import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import RegistrationsHeadline from 'components/registrations/overview/RegistrationsHeadline';
import RegistrationsOverview from 'components/registrations/overview/RegistrationsOverview';
import { RegistrationsOverviewContextProvider } from 'components/registrations/overview/RegistrationsOverviewContext';
import SwrResponseWrapper from 'components/strapi/SwrResponseWrapper';
import useAllRegistrations from 'lib/registrations/useAllRegistrations';
import useAllFullTimeProgramItems from 'lib/strapi/useAllFullTimeProgramItems';
import useAllProgramItems from 'lib/strapi/useAllProgramItems';

const RegistrationsOverviewWrapper = (): ReactElement => {

    const allRegistrationsResponse = useAllRegistrations();
    const allProgramItemsResponse = useAllProgramItems();
    const allFullTimeProgramItemsResponse = useAllFullTimeProgramItems();

    return (
        <div className="min-h-screen pt-[200px] pb-11">
            <SwrResponseWrapper response={allRegistrationsResponse}>
                {(allRegistrations): ReactElement => (
                    <SwrResponseWrapper response={allProgramItemsResponse}>
                        {(allProgramItems): ReactElement => (
                            <SwrResponseWrapper response={allFullTimeProgramItemsResponse}>
                                {(allFullTimeProgramItems): ReactElement => (
                                    <ContentWrapper>
                                        <RegistrationsOverviewContextProvider
                                            allRegistrations={allRegistrations}
                                            allProgramItems={allProgramItems.allProgramItems}
                                            allFullTimeProgramItems={allFullTimeProgramItems.allFullTimeProgramItems}
                                        >
                                            <RegistrationsHeadline />

                                            <RegistrationsOverview />
                                        </RegistrationsOverviewContextProvider>
                                    </ContentWrapper>
                                )}
                            </SwrResponseWrapper>
                        )}
                    </SwrResponseWrapper>
                )}
            </SwrResponseWrapper>
        </div>
    );
};

export default RegistrationsOverviewWrapper;
