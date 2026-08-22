import type { ApplicationStatus, Type } from '@prisma/client';

type PublicProgramEntry = {
    id: number;
    imageFileName: string | null;
    name: string;
    status: ApplicationStatus;
    type: Type;
};

export default PublicProgramEntry;
