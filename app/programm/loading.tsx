import { range } from 'lodash';

const Loading = () => (
    <div className="mx-auto w-full max-w-7xl animate-pulse p-4">
        <div className="mb-6 flex gap-2">
            {range(4).map((n) => (
                <div key={n} className="h-8 w-24 rounded bg-gray-300" />
            ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {range(9).map((n) => (
                <div key={n} className="h-48 rounded bg-gray-200" />
            ))}
        </div>
    </div>
);

export default Loading;
