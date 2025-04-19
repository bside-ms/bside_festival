import { Type } from '@prisma/client';
import concertImage from 'images/types/concert.jpg';
import diskjockeyImage from 'images/types/diskjockey.jpg';
import exhibitionImage from 'images/types/exhibition.jpg';
import familyProgramImage from 'images/types/familyProgram.jpg';
import infoBoothImage from 'images/types/infoBooth.jpg';
import miscImage from 'images/types/misc.jpg';
import performanceImage from 'images/types/performance.jpg';
import readingImage from 'images/types/reading.jpg';
import workshopsImage from 'images/types/workshops.jpg';
import typeLabels from 'lib/participants/typeLabels';
import Image from 'next/image';
import type { ReactElement } from 'react';

interface Props {
    type: Type;
}

const ApplicationTypeImage = ({ type }: Props): ReactElement => {
    switch (type) {
        case Type.Reading:
            return <Image src={readingImage} alt={typeLabels.Reading} fill={true} className="object-cover" />;

        case Type.DiskJockey:
            return <Image src={diskjockeyImage} alt={typeLabels.Reading} fill={true} className="object-cover" />;

        case Type.FamilyProgram:
            return <Image src={familyProgramImage} alt={typeLabels.FamilyProgram} fill={true} className="object-cover" />;

        case Type.Exhibition:
            return <Image src={exhibitionImage} alt={typeLabels.Exhibition} fill={true} className="object-cover" />;

        case Type.Workshop:
            return <Image src={workshopsImage} alt={typeLabels.Workshop} fill={true} className="object-cover" />;

        case Type.Performance:
            return <Image src={performanceImage} alt={typeLabels.Performance} fill={true} className="object-cover" />;

        case Type.Concert:
            return <Image src={concertImage} alt={typeLabels.Concert} fill={true} className="object-cover" />;

        case Type.InfoBooth:
            return <Image src={infoBoothImage} alt={typeLabels.Concert} fill={true} className="object-cover" />;

        default:
            return <Image src={miscImage} alt="Bewerbung" fill={true} className="object-cover" />;
    }
};

export default ApplicationTypeImage;
