import { useEffect } from 'react';
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

    useEffect(() => {
        if (availableApplicationTypes.length === 0) {
            // Need to be done in here to prevent push in server-side pre-render
            router.push('/');
        }
    }, [router, availableApplicationTypes]);

    if (availableApplicationTypes.length === 0) {
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
