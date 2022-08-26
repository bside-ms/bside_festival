import { isAfter } from 'date-fns';
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

const GrowingProgramHint = ({ allFullTimeProgramItems, allProgramItems }: Props): ReactElement | null => {

    const cumulativeProgramItemsAmount = useCumulativeProgramItemsAmount(allProgramItems, allFullTimeProgramItems);

    if (cumulativeProgramItemsAmount === 0) {
        return null;
    }

    if (isAfter(new Date(), new Date('2022/09/11'))) {
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
                        In den Tagen und Wochen bis zum Festival wird unser Programm stets um weitere Veranstaltungen ergänzt.
                        Schau also regelmäßig wieder rein!
                    </div>
                </div>
                <div className="absolute top-1 left-1 -right-1 -bottom-1 bg-gradient-to-r from-[#e1017e] to-[#33bbe9] z-10" />
            </div>
        </ContentWrapper>
    );
};

export default GrowingProgramHint;
