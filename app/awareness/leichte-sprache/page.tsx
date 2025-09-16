import AwarenessEasyGerman from '@/components/awareness/AwarenessEasyGerman';
import type { ReactElement } from 'react';

export default function AwarenessLeichteSprachePage(): ReactElement {
    return (
        <div className="relative mx-auto min-h-screen w-full max-w-7xl pt-5 pb-3">
            <div className="text-center font-display text-6xl uppercase">Awareness</div>

            <AwarenessEasyGerman />
        </div>
    );
}
