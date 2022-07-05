import { isFuture } from 'date-fns';
import { useRouter } from 'next/router';
import type { ReactElement } from 'react';
import ApplicationTypeCards from 'components/application-type-selection/ApplicationTypeCards';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import useApplicationEndDate from 'lib/application-form/useApplicationEndDate';
import useAllApplicationTypes from 'lib/applications/useAllApplicationTypes';

export default (): ReactElement | null => {

    const router = useRouter();

    const availableApplicationTypes = useAllApplicationTypes().filter(
        applicationType => {
            const endDate = useApplicationEndDate(applicationType);

            return isFuture(endDate);
        }
    );

    if (availableApplicationTypes.length === 0) {
        router.push('/');
        return null;
    }

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Bewerbung" />

            <PageHeader theme="blue" />

            <ApplicationTypeCards
                availableApplicationTypes={availableApplicationTypes}
            />

            <Footer />
        </>
    );
};
