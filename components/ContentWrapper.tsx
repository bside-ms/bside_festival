import type { ReactElement, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const ContentWrapper = ({ children }: Props): ReactElement => (
    <div className="w-full md:w-2/3 max-w-5xl mx-auto relative">
        {children}
    </div>
);

export default ContentWrapper;
