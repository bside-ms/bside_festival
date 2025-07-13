import type { CSSProperties, ReactElement } from 'react';

interface Props {
    label: string;
    backgroundColor: CSSProperties['backgroundColor'];
}

const Badge = ({ label, backgroundColor }: Props): ReactElement => {
    return (
        <div
            className="inline-flex h-5 items-center justify-center rounded-2xl px-5 font-mono text-xs leading-4 select-none"
            style={{ backgroundColor }}
        >
            <div>{label}</div>
        </div>
    );
};

export default Badge;
