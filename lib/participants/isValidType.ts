import type { Type } from '@prisma/client';
import availableTypes from 'lib/applications/availableTypes';

const isValidType = (type: string): type is Type =>
    // @ts-expect-error, there's no better way to do this..
    availableTypes.includes(type);

export default isValidType;
