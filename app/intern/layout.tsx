import InternScrollRestoration from '@/components/common/InternScrollRestoration';
import type { PropsWithChildren, ReactElement } from 'react';

const InternLayout = ({ children }: PropsWithChildren): ReactElement => (
    <>
        <InternScrollRestoration />
        {children}
    </>
);

export default InternLayout;
