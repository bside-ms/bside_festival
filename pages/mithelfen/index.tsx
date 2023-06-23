import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import VolunteerForm from 'components/volunteers/VolunteerForm';

export default (): ReactElement | null => {
    return (
        <>
            <NextHead title="B-Side Festival 2023 - Helfer:innen" />

            <VolunteerForm />

            <Footer />
        </>
    );
};
