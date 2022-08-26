import type { ReactElement } from 'react';
import BHeartSvg from 'components/common/BHeartSvg';
import ContentWrapper from 'components/common/ContentWrapper';
import useCumulativeProgramItemsAmount from 'lib/program/useCumulativeProgramItemsAmount';
import type AllFullTimeProgramItems from 'lib/strapi/typings/AllFullTimeProgramItems';
import type AllProgramItems from 'lib/strapi/typings/AllProgramItems';

interface Props {
    allProgramItems: AllProgramItems;
    allFullTimeProgramItems: AllFullTimeProgramItems;
}

const EmptyProgramHint = ({ allFullTimeProgramItems, allProgramItems }: Props): ReactElement | null => {

    const cumulativeProgramItemsAmount = useCumulativeProgramItemsAmount(allProgramItems, allFullTimeProgramItems);

    if (cumulativeProgramItemsAmount > 0) {
        return null;
    }

    return (
        <ContentWrapper>
            <div className="relative">
                <div className="relative z-20 bg-white p-3 flex gap-3 items-center">
                    <div>
                        <BHeartSvg size={70} color="#343422" />
                    </div>
                    <div>
                        Aktuell ist die Liste für diesen Tag noch leer, aber in Kürze findest du hier ein
                        buntes Programm aus Konzerten, Workshops, Ausstellungen und vielem mehr.
                        Schau daher schon bald wieder vorbei!
                    </div>
                </div>
                <div className="absolute top-1 left-1 -right-1 -bottom-1 bg-gradient-to-r from-[#e1017e] to-[#33bbe9] z-10" />
            </div>
        </ContentWrapper>
    );
};

export default EmptyProgramHint;
