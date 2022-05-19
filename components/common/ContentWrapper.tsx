import type { ReactElement, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const ContentWrapper = ({ children }: Props): ReactElement => (
    <div className="w-full px-3 md:w-2/3 md:px-0 max-w-5xl mx-auto relative">
        {children}
    </div>
);

export default ContentWrapper;
