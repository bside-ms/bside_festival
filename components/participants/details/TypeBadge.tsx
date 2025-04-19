import type { Type } from '.prisma/client';
import typeColors from 'lib/participants/typeColors';
import typeLabels from 'lib/participants/typeLabels';
import type { ReactElement } from 'react';

interface Props {
    type: Type;
}

const TypeBadge = ({ type }: Props): ReactElement => {
    return (
        <div className="inline-block rounded-2xl px-3 py-1 text-sm uppercase select-none" style={{ backgroundColor: typeColors[type] }}>
            {typeLabels[type]}
        </div>
    );
};

export default TypeBadge;
