import { useCallback } from 'react';
import type { Type } from '@prisma/client';
import type { ReactElement } from 'react';
import ApplicationTypeImage from 'components/applications/applicationForm/ApplicationTypeImage';
import availableTypes from 'lib/applications/availableTypes';
import typeLabels from 'lib/participants/typeLabels';

const TypeSelect = ({ type, onSelect }: { type: Type, onSelect: (type: Type) => void }): ReactElement => {

    const handleClick = useCallback(() => onSelect(type), [onSelect, type]);

    return (
        <div className="relative h-52" onClick={handleClick}>
            <ApplicationTypeImage type={type} />

            <div className="absolute top-0 right-0 bottom-0 left-0 opacity-50 bg-gray-600 hover:bg-gray-400 md:cursor-pointer" />

            <div className="absolute right-0 bottom-0 left-0 text-gray-100 px-3 md:px-6 py-1 md:py-3 text-xl md:text-2xl font-bold break-all">
                {typeLabels[type]}
            </div>
        </div>
    );
};

interface Props {
    onSelect: (type: Type) => void;
}

const ApplicationTypeSelection = ({ onSelect }: Props): ReactElement => {

    return (
        <div className="grid grid-cols-2 gap-4">
            {availableTypes.map(availableType => (
                <div key={availableType} className="">
                    <TypeSelect type={availableType} onSelect={onSelect} />
                </div>
            ))}
        </div>
    );
};

export default ApplicationTypeSelection;
