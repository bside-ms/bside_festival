import { deburr } from 'lodash';

const normalizeSearchText = (value: string): string => deburr(value).toLowerCase();

const searchTokens = (value: string): Array<string> =>
    normalizeSearchText(value)
        .split(/[^a-z0-9]+/)
        .filter((token) => token.length > 0);

const sharedPrefixLength = (left: string, right: string): number => {
    const limit = Math.min(left.length, right.length);
    let index = 0;

    while (index < limit && left[index] === right[index]) {
        index += 1;
    }

    return index;
};

const levenshteinDistance = (left: string, right: string): number => {
    if (left === right) {
        return 0;
    }

    if (left.length === 0) {
        return right.length;
    }

    if (right.length === 0) {
        return left.length;
    }

    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

    for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
        let previousDiagonal = leftIndex;
        previous[0] = leftIndex + 1;

        for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
            const insertion = (previous[rightIndex] ?? 0) + 1;
            const deletion = (previous[rightIndex + 1] ?? 0) + 1;
            const substitution = previousDiagonal + (left[leftIndex] === right[rightIndex] ? 0 : 1);
            previousDiagonal = previous[rightIndex + 1] ?? 0;
            previous[rightIndex + 1] = Math.min(insertion, deletion, substitution);
        }
    }

    return previous[right.length] ?? right.length;
};

/** Allow at most one edit for short queries, two for longer ones — and only with a strong shared prefix. */
const maxFuzzyDistance = (needle: string): number => {
    if (needle.length >= 8) {
        return 2;
    }

    if (needle.length >= 4) {
        return 1;
    }

    return 0;
};

const tokenMatchesNeedle = (token: string, needle: string): boolean => {
    const distanceLimit = maxFuzzyDistance(needle);

    if (distanceLimit === 0) {
        return false;
    }

    if (Math.abs(token.length - needle.length) > distanceLimit) {
        return false;
    }

    const prefixLength = sharedPrefixLength(token, needle);

    if (prefixLength < 4 || prefixLength < needle.length - distanceLimit) {
        return false;
    }

    return levenshteinDistance(token, needle) <= distanceLimit;
};

const matchesParticipantSearch = (participant: { contactName?: string | null; name: string }, searchText: string): boolean => {
    const needle = normalizeSearchText(searchText.trim());

    if (needle.length === 0) {
        return true;
    }

    const fields = [participant.name, participant.contactName ?? ''];

    if (fields.some((field) => normalizeSearchText(field).includes(needle))) {
        return true;
    }

    return fields.some((field) => searchTokens(field).some((token) => tokenMatchesNeedle(token, needle)));
};

export default matchesParticipantSearch;
