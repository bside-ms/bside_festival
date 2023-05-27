import type { ReactElement } from 'react';
import ApplicationForm from 'components/applications/applicationForm/ApplicationForm';
import Footer from 'components/common/Footer';
import PageHeader from 'components/common/PageHeader';

export default (): ReactElement => {

    return (
        <>

            <PageHeader theme="pink" symbols="none" />

            <div
                className="min-h-screen py-40 relative w-full"
                style={{ background: '#ffe698' }}
            >
                <div
                    className="p-5 md:p-10 w-full md:w-2/3 max-w-[700px] mx-auto drop-shadow-xl"
                    style={{ background: 'linear-gradient(180deg, rgb(41 148 189 / 90%) 0%, rgb(64 121 143 / 90%) 100%)' }}
                >
                    <ApplicationForm />
                </div>
            </div>

            <Footer />
        </>
    );
};
