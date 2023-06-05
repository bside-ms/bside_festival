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
            return <Image src="/assets/images/types/reading.jpg" alt={typeLabels.Reading} fill={true} className="object-cover" />;
        case Type.FamilyProgram:
            return <Image src="/assets/images/types/familyProgram.jpg" alt={typeLabels.FamilyProgram} fill={true} className="object-cover" />;
        case Type.Exhibition:
            return <Image src="/assets/images/types/exhibition.jpg" alt={typeLabels.Exhibition} fill={true} className="object-cover" />;
        case Type.Workshop:
            return <Image src="/assets/images/types/workshop.jpg" alt={typeLabels.Workshop} fill={true} className="object-cover" />;
        case Type.Performance:
            return <Image src="/assets/images/types/performance.jpg" alt={typeLabels.Performance} fill={true} className="object-cover" />;
        case Type.Concert:
            return <Image src="/assets/images/types/concert.jpg" alt={typeLabels.Concert} fill={true} className="object-cover" />;
        default:
            return <Image src="/assets/images/types/concert.jpg" alt="Bewerbung" fill={true} className="object-cover" />;
    }
};

export default ApplicationTypeImage;
