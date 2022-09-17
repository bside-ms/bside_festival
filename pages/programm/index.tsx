import type { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import NextHead from 'components/common/NextHead';
import PageHeader from 'components/common/PageHeader';
import Program from 'components/program/program/Program';
import { ProgramContextProvider } from 'components/program/program/ProgramContext';
import PageAlert from 'components/common/PageAlert';

export default (): ReactElement => {

    return (
        <>
            <NextHead title="B-Side Festival 2022 - Programm" />

            <PageAlert />

            <PageHeader theme="pink" symbols="hearts" />

            <ProgramContextProvider>
                <Program />
            </ProgramContextProvider>

            <Footer />
        </>
    );
};
