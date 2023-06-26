import type { ReactElement } from 'react';
import ApplicationForm from 'components/applications/applicationForm/ApplicationForm';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';

export default (): ReactElement => {

    return (
        <div>
            <div className="min-h-screen w-full relative ">
                <div className="relative z-10">

                    <div
                        className="p-5 md:p-10 w-full md:w-2/3 max-w-[700px] mx-auto drop-shadow-xl"
                    >
                        <ApplicationForm />
                    </div>

                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
