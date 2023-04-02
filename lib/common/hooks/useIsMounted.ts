import { useState } from 'react';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';

const useIsMounted = (): boolean => {

    const [isMounted, setIsMounted] = useState(false);
    useEffectOnMount(() => setIsMounted(true));

    return isMounted;
};

export default useIsMounted;
