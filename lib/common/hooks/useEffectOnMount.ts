import { useEffect } from 'react';
import type { EffectCallback } from 'react';

/**
 * Just a small hook to use when you want to make it explicit that this
 * effectful code must only be run once on mount
 */
const useEffectOnMount = (effect: EffectCallback): void => useEffect(effect, []);

export default useEffectOnMount;
