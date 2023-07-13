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
        <div className="flex gap-1 mb-1">
            {labels.map(({ id, label }) => (
                <div
                    key={id}
                    className="uppercase inline-block select-none rounded-2xl text-xs px-3 py-1 bg-gray-200 text-gray-700"
                >
                    {label}
                </div>
            ))}
        </div>
    );
};

export default ApplicationLabels;
