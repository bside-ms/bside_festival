import type { ChangeLogAction, ChangeLogTargetType } from '@prisma/client';

interface ChangeLogValue {
    raw: unknown;
    display: string;
}

export interface ChangeLogChange {
    field: string;
    label: string;
    previous: ChangeLogValue;
    next: ChangeLogValue;
}

interface ChangeLogTarget {
    type: ChangeLogTargetType;
    id: number;
    name: string;
}

export interface ChangeLogEvent {
    action: ChangeLogAction;
    target: ChangeLogTarget;
    changes: Array<ChangeLogChange>;
}
