import type { ReactElement, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const ContentWrapper = ({ children }: Props): ReactElement => (
    <div className="relative mx-auto w-full max-w-5xl px-3 md:w-2/3 md:px-0">{children}</div>
);

export default ContentWrapper;
