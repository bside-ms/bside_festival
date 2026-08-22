import type { ReactElement } from 'react';

const Loading = (): ReactElement => (
    <div className="min-h-screen animate-pulse bg-[#EA504C] font-display" aria-busy="true" aria-label="Programmbeitrag wird geladen">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-16">
            <div className="h-6 w-40 bg-[#2C2E83]/25" />
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
                <div className="aspect-[4/5] rounded-sm bg-[#2C2E83]/25 lg:min-h-140" />
                <div>
                    <div className="h-7 w-28 bg-[#2C2E83]/25" />
                    <div className="mt-5 h-16 w-3/4 bg-white/80" />
                    <div className="mt-6 h-5 w-full bg-white/55" />
                    <div className="mt-3 h-5 w-5/6 bg-white/55" />
                </div>
            </div>
        </div>
    </div>
);

export default Loading;
