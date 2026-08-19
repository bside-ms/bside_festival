import { describe, expect, it } from 'vitest';
import { getPageHash } from './scrollToPageHash';

describe('getPageHash', () => {
    it('reads the hash from a home section href', () => {
        expect(getPageHash('/#wo-und-wann')).toBe('wo-und-wann');
        expect(getPageHash('/#ueber-uns')).toBe('ueber-uns');
    });

    it('returns undefined without a usable hash', () => {
        expect(getPageHash('/awareness')).toBeUndefined();
        expect(getPageHash('/#')).toBeUndefined();
        expect(getPageHash('#')).toBeUndefined();
    });
});
