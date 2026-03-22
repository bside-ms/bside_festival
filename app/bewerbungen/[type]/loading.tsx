import { range } from 'lodash';

const Loading = () => (
    <div className="relative min-h-screen w-full">
        <div className="relative z-10 mx-auto w-full max-w-[700px] animate-pulse p-5 md:w-2/3 md:p-8">
            <div className="mb-6 h-10 w-32 rounded bg-gray-300" />
            <div className="mb-4 h-52 rounded bg-gray-200" />
            <div className="space-y-4">
                {range(6).map((n) => (
                    <div key={n} className="h-12 rounded bg-gray-200" />
                ))}
            </div>
        </div>
    </div>
);

export default Loading;
