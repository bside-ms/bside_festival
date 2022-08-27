import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';

interface Props {
    title: string;
}

const ProgramTypeTitle = ({ title }: Props): ReactElement | null => {

    return (
        <>
            <div className="flex ">
                <div className="grow bg-gradient-to-l from-[#e1017e] via-transparent" />
                <div className="w-2/3 shrink-0 max-w-5xl relative bg-gradient-to-r from-[#e1017e] to-[#33bbe9] text-white text-3xl hidden md:block">
                    <div className="font-display py-4">
                        {title}
                    </div>
                </div>
                <div className="grow bg-gradient-to-r from-[#33bbe9] via-transparent" />
            </div>
            <div className="bg-gradient-to-r from-[#e1017e] to-[#33bbe9] text-white text-3xl md:hidden">
                <ContentWrapper>
                    <div className="font-display py-4">
                        {title}
                    </div>
                </ContentWrapper>
            </div>
        </>
    );
};

export default ProgramTypeTitle;
