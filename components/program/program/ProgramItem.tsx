import type { ReactElement } from 'react';
import ProgramItemDetails from 'components/program/program/ProgramItemDetails';
import ProgramItemImage from 'components/program/program/ProgramItemImage';
import ProgramItemName from 'components/program/program/ProgramItemName';
import type { default as ProgramItemModel } from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItemModel;
}

const ProgramItem = ({ programItem }: Props): ReactElement => {

    return (
        <>
            <div className="absolute z-20 bg-white hover:bg-gray-200 top-0 right-0 bottom-0 left-0 flex">
                <ProgramItemImage programItem={programItem} />

                <div className="p-2 md:p-5">
                    <ProgramItemName programItem={programItem} />

                    <ProgramItemDetails programItem={programItem} />
                </div>
            </div>

            <div className="absolute top-1 left-1 -right-1 -bottom-1 bg-gradient-to-r from-[#e1017e] to-[#33bbe9] z-10" />
        </>
    );
};

export default ProgramItem;
