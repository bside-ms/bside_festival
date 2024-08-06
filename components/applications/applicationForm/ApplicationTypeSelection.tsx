import type { Type } from '@prisma/client';
import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationTypeImage from 'components/applications/applicationForm/ApplicationTypeImage';
import availableTypes from 'lib/applications/availableTypes';
import { typeLabelsWithSoftHyphens } from 'lib/participants/typeLabels';
import typeUrlPaths from 'lib/participants/typeUrlPaths';

const TypeSelect = ({ type }: { type: Type }): ReactElement => {
    return (
        <Link className="group relative block h-52" href={`/bewerbungen/${typeUrlPaths[type]}`}>
            <ApplicationTypeImage type={type} />

            <div className="absolute inset-0 bg-gray-600 opacity-50 transition-colors group-hover:bg-gray-400 md:cursor-pointer" />

            <div
                className="absolute inset-x-0 bottom-0 px-3 py-1 font-display text-lg text-white md:px-6 md:py-3 md:text-xl"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: typeLabelsWithSoftHyphens[type] }}
            />
        </Link>
    );
};

const ApplicationTypeSelection = (): ReactElement => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {availableTypes.map((availableType) => (
                <div key={availableType} className="">
                    <TypeSelect type={availableType} />
                </div>
            ))}
        </div>
    );
};

export default ApplicationTypeSelection;
