import type { ReactElement } from 'react';

const Loading = (): ReactElement => (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl px-2 pt-5 pb-3">
        <div className="rounded-md border border-black bg-white/80 p-5 font-bold shadow-lg">Programmbeiträge werden geladen...</div>
    </div>
);

export default Loading;
