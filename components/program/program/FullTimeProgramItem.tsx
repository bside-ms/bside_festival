import type { ReactElement } from 'react';
import FullTimeProgramItemDetails from 'components/program/program/FullTimeProgramItemDetails';
import ProgramItemImage from 'components/program/program/ProgramItemImage';
import ProgramItemName from 'components/program/program/ProgramItemName';
import type { default as FullTimeProgramItemModel } from 'lib/strapi/typings/FullTimeProgramItem';

interface Props {
    programItem: FullTimeProgramItemModel;
}

const FullTimeProgramItem = ({ programItem }: Props): ReactElement => {

    return (
        <div className="cursor-pointer relative grow h-[120px] md:h-[250px]">
            <div className="absolute z-20 bg-white top-0 right-0 bottom-0 left-0 flex">
                <ProgramItemImage programItem={programItem} />

                <div className="p-2 md:p-5">
                    <ProgramItemName programItem={programItem} />

                    <FullTimeProgramItemDetails programItem={programItem} />
                </div>
            </div>

            <div className="absolute top-1 left-1 -right-1 -bottom-1 bg-gradient-to-r from-[#e1017e] to-[#33bbe9] z-10" />
        </div>
    );
};

export default FullTimeProgramItem;
