import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';

interface Props {
    title: string;
}

const ProgramTypeTitle = ({ title }: Props): ReactElement | null => {

    return (
        <div className="bg-gradient-to-r from-[#e1017e] to-[#33bbe9] text-white text-3xl">
            <ContentWrapper>
                <div className="font-display py-4">
                    {title}
                </div>
            </ContentWrapper>
        </div>
    );
};

export default ProgramTypeTitle;
