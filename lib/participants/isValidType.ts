import availableTypes from '@/lib/applications/availableTypes';
import type { Type } from '@prisma/client';

const isValidType = (type: string): type is Type =>
    // @ts-expect-error, there's no better way to do this..
    availableTypes.includes(type);

export default isValidType;
