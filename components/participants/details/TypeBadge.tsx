import type { ReactElement } from 'react';
import type { Type } from '.prisma/client';
import typeColors from 'lib/participants/typeColors';
import typeLabels from 'lib/participants/typeLabels';

interface Props {
    type: Type;
}

const TypeBadge = ({ type }: Props): ReactElement => {
    return (
        <div className="inline-block select-none rounded-2xl px-3 py-1 text-sm uppercase" style={{ backgroundColor: typeColors[type] }}>
            {typeLabels[type]}
        </div>
    );
};

export default TypeBadge;
