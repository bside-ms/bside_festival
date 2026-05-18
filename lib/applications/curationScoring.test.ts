import { describe, expect, it } from 'vitest';
import { calculateAverage, calculateCurationScores, formatCurationScore, isLocalZipcode, parseJuryVotes } from './curationScoring';

describe('curationScoring', () => {
    it('calculates average jury scores', () => {
        expect(calculateAverage([5, 5, 4])).toBeCloseTo(4.6666666667);
        expect(calculateAverage([5, 1, 2, 3])).toBe(2.75);
    });

    it('treats empty votes as not curated yet', () => {
        const scores = calculateCurationScores({
            participantCount: 1,
            flintaParticipantsCount: 0,
            hasMarginalizedParticipants: false,
            hasParticipatedBefore: false,
            zipcodes: [],
            juryVotes: null,
        });

        expect(scores.juryScore).toBeNull();
        expect(scores.finalScore).toBeNull();
        expect(scores.bonusParts.firstTime).toBe(1);
    });

    it('calculates proportional FLINTA and localness bonuses', () => {
        const scores = calculateCurationScores({
            participantCount: 4,
            flintaParticipantsCount: 2,
            hasMarginalizedParticipants: false,
            hasParticipatedBefore: true,
            zipcodes: [
                { code: '48143', isInternational: false },
                { code: '48282', isInternational: false },
                { code: '50667', isInternational: false },
                { code: 'Niederlande', isInternational: true },
            ],
            juryVotes: [4],
        });

        expect(scores.bonusParts.flinta).toBe(0.5);
        expect(scores.bonusParts.local).toBe(0.5);
        expect(scores.bonusScore).toBe(1);
        expect(scores.finalScore).toBe(5);
    });

    it('adds marginalized and first-time bonuses only when explicitly eligible', () => {
        expect(
            calculateCurationScores({
                participantCount: 1,
                flintaParticipantsCount: 0,
                hasMarginalizedParticipants: true,
                hasParticipatedBefore: false,
                zipcodes: [],
                juryVotes: [0],
            }).bonusScore,
        ).toBe(2);

        expect(
            calculateCurationScores({
                participantCount: 1,
                flintaParticipantsCount: 0,
                hasMarginalizedParticipants: false,
                hasParticipatedBefore: null,
                zipcodes: [],
                juryVotes: [0],
            }).bonusScore,
        ).toBe(0);
    });

    it('recognizes nearby Muenster postcode prefixes', () => {
        expect(isLocalZipcode({ code: '48155', isInternational: false })).toBe(true);
        expect(isLocalZipcode({ code: '48291', isInternational: false })).toBe(true);
        expect(isLocalZipcode({ code: '48301', isInternational: false })).toBe(true);
        expect(isLocalZipcode({ code: '48431', isInternational: false })).toBe(false);
        expect(isLocalZipcode({ code: '48155', isInternational: true })).toBe(false);
    });

    it('validates jury vote JSON shape', () => {
        expect(parseJuryVotes([0, 1, 5])).toEqual([0, 1, 5]);
        expect(parseJuryVotes(null)).toBeNull();
        expect(parseJuryVotes([0, 6])).toBeNull();
        expect(parseJuryVotes([1.5])).toBeNull();
        expect(parseJuryVotes({ votes: [1] })).toBeNull();
    });

    it('formats scores with rounded display only', () => {
        expect(formatCurationScore(4.333333333)).toBe('4,33');
        expect(formatCurationScore(null)).toBe('Offen');
    });
});
