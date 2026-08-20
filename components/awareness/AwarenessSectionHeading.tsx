import type { ReactElement, ReactNode } from 'react';

const AwarenessSectionHeading = ({ children }: { children: ReactNode }): ReactElement => {
    return <h2 className="mb-3 font-display text-xl font-black text-[#1d2a6b]">{children}</h2>;
};

export default AwarenessSectionHeading;
