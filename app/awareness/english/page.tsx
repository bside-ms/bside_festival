import AwarenessEnglishVersion from '@/components/awareness/AwarenessEnglishVersion';
import Image from 'next/image';
import type { ReactElement } from 'react';

export default function AwarenessEnglishPage(): ReactElement {
    return (
        <div className="relative min-h-screen w-full">
            <div className="relative z-10">
                <div className="mx-auto w-full max-w-[700px] p-5 drop-shadow-xl md:w-2/3 md:p-10">
                    <AwarenessEnglishVersion />
                </div>
            </div>

            <Image src="/assets/background.webp" alt="Hintergrund" className="absolute z-0 object-cover object-top" fill={true} />
        </div>
    );
}
