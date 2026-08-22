import ProgramScrollRestoration from '@/components/participants/publicProgram/ProgramScrollRestoration';
import type { PropsWithChildren, ReactElement } from 'react';

const ProgramLayout = ({ children }: PropsWithChildren): ReactElement => (
    <>
        <ProgramScrollRestoration />
        {children}
    </>
);

export default ProgramLayout;
