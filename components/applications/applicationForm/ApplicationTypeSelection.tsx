import type { Type } from '@prisma/client';
import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationTypeImage from 'components/applications/applicationForm/ApplicationTypeImage';
import availableTypes from 'lib/applications/availableTypes';
import typeLabels from 'lib/participants/typeLabels';
import typeUrlPaths from 'lib/participants/typeUrlPaths';

const TypeSelect = ({ type }: { type: Type }): ReactElement => {

    return (
        <Link className="block relative h-52" href={`/bewerbungen/${typeUrlPaths[type]}`}>
            <ApplicationTypeImage type={type} />

            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-50 bg-gray-600 hover:bg-gray-400 md:cursor-pointer" />

            <div className="absolute right-0 bottom-0 left-0 px-3 md:px-6 py-1 md:py-3 text-lg md:text-xl font-display text-white break-all">
                {typeLabels[type]}
            </div>
        </Link>
    );
};

const ApplicationTypeSelection = (): ReactElement => {

    return (
        <div className="grid grid-cols-2 gap-4">
            {availableTypes.map(availableType => (
                <div key={availableType} className="">
                    <TypeSelect type={availableType} />
                </div>
            ))}
        </div>
    );
};

export default ApplicationTypeSelection;
