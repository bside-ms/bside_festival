import { range } from 'lodash';

const Loading = () => (
    <div className="mx-auto w-full max-w-7xl animate-pulse p-4">
        <div className="mb-4 h-8 w-48 rounded bg-gray-300" />
        <div className="space-y-3">
            {range(8).map((n) => (
                <div key={n} className="h-16 rounded bg-gray-200" />
            ))}
        </div>
    </div>
);

export default Loading;
