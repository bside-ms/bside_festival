import { isEqual } from 'lodash';
import type { ChangeLogChange } from './changeLogTypes';

const toJsonValue = (value: unknown): unknown => {
    if (value instanceof Date) {
        return value.toISOString();
    }

    if (value === undefined) {
        return null;
    }

    return value;
};

export const createChange = <T>(
    field: string,
    label: string,
    previousValue: T,
    nextValue: T,
    format: (value: T) => string,
): ChangeLogChange | null => {
    const previous = toJsonValue(previousValue);
    const next = toJsonValue(nextValue);

    if (isEqual(previous, next)) {
        return null;
    }

    return {
        field,
        label,
        previous: {
            raw: previous,
            display: format(previousValue),
        },
        next: {
            raw: next,
            display: format(nextValue),
        },
    };
};
