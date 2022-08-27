import { useCallback } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { useProgramContext } from 'components/program/program/ProgramContext';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
    children: ReactNode;
}

const ProgramItemWrapper = ({ programItem, children }: Props): ReactElement => {

    const { setProgramItemForModal } = useProgramContext();

    const { artistId, artist } = getDetailsFromProgramItem(programItem);

    const showModal = useCallback(() => setProgramItemForModal(programItem), [programItem, setProgramItemForModal]);

    if (artistId === null || artist === null) {
        return (
            <div className="relative grow h-[170px] md:h-[250px]">
                {children}
            </div>
        );
    }

    return (
        <div className="block cursor-pointer relative grow h-[170px] md:h-[250px]" onClick={showModal}>
            {children}
        </div>
    );
};

export default ProgramItemWrapper;
