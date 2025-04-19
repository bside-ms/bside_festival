import type { Label } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    labels: Array<Label>;
}

const ApplicationLabels = ({ labels }: Props): ReactElement | null => {
    if (labels.length === 0) {
        return null;
    }

    return (
        <div className="mb-1 flex gap-1">
            {labels.map(({ id, label }) => (
                <div key={id} className="inline-block rounded-2xl bg-gray-200 px-3 py-1 text-xs text-gray-700 uppercase select-none">
                    {label}
                </div>
            ))}
        </div>
    );
};

export default ApplicationLabels;
