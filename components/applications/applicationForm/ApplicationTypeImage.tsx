import { Type } from '@prisma/client';
import Image from 'next/image';
import type { ReactElement } from 'react';
import typeLabels from 'lib/participants/typeLabels';

interface Props {
    type: Type;
}

const ApplicationTypeImage = ({ type }: Props): ReactElement => {
    switch (type) {
        case Type.Reading:
            return <Image src="/assets/images/types/reading.jpeg" alt={typeLabels.Reading} fill={true} className="object-cover" />;
        case Type.FamilyProgram:
            return (
                <Image src="/assets/images/types/familyProgram.jpeg" alt={typeLabels.FamilyProgram} fill={true} className="object-cover" />
            );
        case Type.Exhibition:
            return <Image src="/assets/images/types/exhibition.jpeg" alt={typeLabels.Exhibition} fill={true} className="object-cover" />;
        case Type.Workshop:
            return <Image src="/assets/images/types/workshop.jpeg" alt={typeLabels.Workshop} fill={true} className="object-cover" />;
        case Type.Performance:
            return <Image src="/assets/images/types/performance.jpeg" alt={typeLabels.Performance} fill={true} className="object-cover" />;
        case Type.Concert:
            return <Image src="/assets/images/types/concert.jpeg" alt={typeLabels.Concert} fill={true} className="object-cover" />;
        default:
            return <Image src="/assets/images/types/misc.jpeg" alt="Bewerbung" fill={true} className="object-cover" />;
    }
};

export default ApplicationTypeImage;
