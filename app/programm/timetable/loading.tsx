import { range } from 'lodash';

const Loading = () => (
    <div className="min-h-screen w-full animate-pulse overflow-auto p-4">
        <div className="mb-4 h-8 w-48 rounded bg-gray-300" />
        <div className="flex gap-2">
            {range(5).map((n) => (
                <div key={n} className="h-[600px] w-48 rounded bg-gray-200" />
            ))}
        </div>
    </div>
);

export default Loading;
