import { range } from 'lodash';
import type { ReactElement } from 'react';

const Loading = (): ReactElement => (
    <div
        className="min-h-screen animate-pulse bg-[#EA504C] font-display text-[#2C2E83]"
        aria-busy="true"
        aria-label="Programm wird geladen"
    >
        <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-6">
            <div className="h-3 w-40 bg-[#2C2E83]/25" />
            <div className="mt-4 h-12 w-56 bg-white/80 sm:h-14 sm:w-64 md:h-18 md:w-72" />
            <div className="mt-5 h-12 max-w-xl bg-white/85" />
        </div>

        <div className="sticky top-15 z-20 border-y border-[#2C2E83]/20 bg-[#EA504C]">
            <div className="mx-auto w-full max-w-6xl px-6 py-4 md:px-10 md:py-5">
                <div className="h-9 w-36 bg-white/80 md:h-12 md:w-48" />
            </div>
        </div>

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-2 md:px-10 lg:grid-cols-3 xl:grid-cols-4">
            {range(12).map((index) => (
                <div key={index} className="aspect-[4/5] rounded-sm bg-[#2C2E83]/25" />
            ))}
        </div>
    </div>
);

export default Loading;
