import type { ReactElement } from 'react';

const ProgramItemPlaceholder = (): ReactElement => {

    return (
        <div className="relative grow h-[170px] md:h-[250px]">
            <div className="absolute z-20 bg-white hover:bg-gray-200 top-0 right-0 bottom-0 left-0 flex" />

            <div className="absolute top-1 left-1 -right-1 -bottom-1 bg-gradient-to-r from-[#e1017e] to-[#33bbe9] z-10" />
        </div>
    );
};

export default ProgramItemPlaceholder;
