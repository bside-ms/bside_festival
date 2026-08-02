const SENSITIVE_KEY_PATTERN = /authorization|base64|cookie|encoded|password|secret|token/i;
const MAX_STRING_LENGTH = 500;
const MAX_ARRAY_LENGTH = 50;
const MAX_OBJECT_KEYS = 40;
const MAX_DEPTH = 4;

export const sanitizeActionErrorContext = (value: unknown, depth = 0): unknown => {
    if (depth > MAX_DEPTH) {
        return '[truncated]';
    }

    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === 'string') {
        return value.length > MAX_STRING_LENGTH ? `${value.slice(0, MAX_STRING_LENGTH)}…` : value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'bigint') {
        return value.toString();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (Array.isArray(value)) {
        return value.slice(0, MAX_ARRAY_LENGTH).map((entry) => sanitizeActionErrorContext(entry, depth + 1));
    }

    if (typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>)
                .filter(([key]) => !SENSITIVE_KEY_PATTERN.test(key))
                .slice(0, MAX_OBJECT_KEYS)
                .map(([key, entry]) => [key, sanitizeActionErrorContext(entry, depth + 1)]),
        );
    }

    return String(value);
};
