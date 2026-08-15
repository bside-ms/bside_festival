import { range } from 'lodash';
import type { ReactElement } from 'react';

const Loading = (): ReactElement => (
    <div className="relative mx-auto min-h-full w-full max-w-7xl animate-pulse px-2 pt-5 pb-3">
        <div className="space-y-4">
            <div className="flex flex-col gap-3">
                <div className="h-4 w-40 rounded bg-gray-200" />

                <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 w-20 rounded bg-gray-300" />
                    <div className="h-6 w-16 rounded bg-gray-200" />
                    <div className="h-6 w-24 rounded bg-gray-200" />
                </div>

                <div className="h-10 w-2/3 max-w-xl rounded bg-gray-300" />
            </div>

            <div className="overflow-hidden rounded-md border border-black bg-white shadow-sm">
                <div className="grid gap-4 bg-white p-3 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="min-w-0 space-y-4">
                        {range(5).map((n) => (
                            <div key={n} className="space-y-2">
                                <div className="h-4 w-24 rounded bg-gray-300" />
                                <div className="h-20 w-full rounded bg-gray-100" />
                            </div>
                        ))}
                    </div>

                    <aside className="space-y-5 self-start rounded-md border border-black bg-gray-50 p-3">
                        <div className="space-y-2">
                            <div className="h-6 w-20 rounded bg-gray-300" />
                            <div className="h-10 w-full rounded bg-gray-200" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-6 w-28 rounded bg-gray-300" />
                            <div className="h-10 w-full rounded bg-gray-200" />
                            <div className="flex gap-2">
                                <div className="h-8 w-8 rounded-full bg-gray-200" />
                                <div className="h-8 w-8 rounded-full bg-gray-200" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-6 w-16 rounded bg-gray-300" />
                            <div className="h-10 w-full rounded bg-gray-200" />
                        </div>

                        <div className="space-y-3">
                            <div className="h-6 w-24 rounded bg-gray-300" />
                            {range(3).map((n) => (
                                <div key={n} className="space-y-1">
                                    <div className="h-3 w-28 rounded bg-gray-200" />
                                    <div className="h-12 w-full rounded bg-gray-100" />
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    </div>
);

export default Loading;
