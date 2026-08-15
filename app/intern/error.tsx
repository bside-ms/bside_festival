'use client';

import type { ReactElement } from 'react';

const Error = (): ReactElement => (
    <div className="relative mx-auto min-h-full w-full max-w-7xl px-2 pt-5 pb-3">
        <div className="rounded-md border border-red-700 bg-red-50 p-5 font-bold text-red-900">
            Die internen Programmbeiträge konnten nicht geladen werden.
        </div>
    </div>
);

export default Error;
