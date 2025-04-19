import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import { useState } from 'react';

const useIsMounted = (): boolean => {
    const [isMounted, setIsMounted] = useState(false);
    useEffectOnMount(() => setIsMounted(true));

    return isMounted;
};

export default useIsMounted;
