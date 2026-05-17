import type { Zipcode } from '@prisma/client';
import { clamp, sumBy } from 'lodash';

const curationMinimumJuryVote = 0;
const curationMaximumJuryVote = 5;
export const localZipcodePrefixes = ['481', '482', '483'] as const;

interface CurationBonusScoreParts {
    flinta: number;
    marginalized: number;
    firstTime: number;
    local: number;
}

export interface CurationScoreInput {
    participantCount: number;
    flintaParticipantsCount: number;
    hasMarginalizedParticipants: boolean;
    hasParticipatedBefore: boolean | null | undefined;
    zipcodes: Array<Pick<Zipcode, 'code' | 'isInternational'>>;
    juryVotes: Array<number> | null;
}

export interface CurationScoreResult {
    juryScore: number | null;
    bonusScore: number;
    bonusParts: CurationBonusScoreParts;
    finalScore: number | null;
}

const isValidJuryVote = (vote: unknown): vote is number => {
    return typeof vote === 'number' && Number.isInteger(vote) && vote >= curationMinimumJuryVote && vote <= curationMaximumJuryVote;
};

export const parseJuryVotes = (value: unknown): Array<number> | null => {
    if (value === null || value === undefined) {
        return null;
    }

    if (!Array.isArray(value) || !value.every(isValidJuryVote)) {
        return null;
    }

    return value;
};

export const calculateAverage = (values: Array<number>): number | null => {
    if (values.length === 0) {
        return null;
    }

    return sumBy(values) / values.length;
};

const calculateProportionalBonus = (part: number, total: number): number => {
    if (total <= 0) {
        return 0;
    }

    return clamp(part / total, 0, 1);
};

export const isLocalZipcode = ({ code, isInternational }: Pick<Zipcode, 'code' | 'isInternational'>): boolean => {
    return !isInternational && localZipcodePrefixes.some((prefix) => code.startsWith(prefix));
};

const calculateBonusParts = ({
    participantCount,
    flintaParticipantsCount,
    hasMarginalizedParticipants,
    hasParticipatedBefore,
    zipcodes,
}: Omit<CurationScoreInput, 'juryVotes'>): CurationBonusScoreParts => ({
    flinta: calculateProportionalBonus(flintaParticipantsCount, participantCount),
    marginalized: hasMarginalizedParticipants ? 1 : 0,
    firstTime: hasParticipatedBefore === false ? 1 : 0,
    local: calculateProportionalBonus(
        sumBy(zipcodes, (zipcode) => (isLocalZipcode(zipcode) ? 1 : 0)),
        zipcodes.length,
    ),
});

export const calculateCurationScores = (input: CurationScoreInput): CurationScoreResult => {
    const juryScore = calculateAverage(input.juryVotes ?? []);
    const bonusParts = calculateBonusParts(input);
    const bonusScore = bonusParts.flinta + bonusParts.marginalized + bonusParts.firstTime + bonusParts.local;

    return {
        juryScore,
        bonusScore,
        bonusParts,
        finalScore: juryScore === null ? null : juryScore + bonusScore,
    };
};

export const formatCurationScore = (score: number | null, maximumFractionDigits = 2): string => {
    if (score === null) {
        return 'Offen';
    }

    return score.toLocaleString('de-DE', {
        maximumFractionDigits,
    });
};
