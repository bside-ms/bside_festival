import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import RestrictedAccess from 'components/common/RestrictedAccess';
import TimeTableWrapper from 'components/program/timeTable/TimeTableWrapper';

export default (): ReactElement => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Slotplan" />

            <PageHeader theme="yellow" symbols="none" />

            <RestrictedAccess>
                <div className="min-h-screen pt-[150px]">
                    <div className="w-full pl-5 mx-auto relative">
                        <TimeTableWrapper />
                    </div>
                </div>
            </RestrictedAccess>

            <Footer />
        </>
    );
};
