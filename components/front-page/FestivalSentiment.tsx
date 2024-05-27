import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import FestivalImageGrid from 'components/front-page/FestivalImageGrid';

const FestivalSentiment = (): ReactElement => {
    return (
        <div className="bg-[#3eb0e3] px-5 py-10">
            <ContentWrapper>
                <div className="mb-5 text-center font-display text-3xl text-white">
                    Ein Festival
                    <br />
                    von Vielen
                    <br />
                    für Alle
                </div>

                <FestivalImageGrid />
            </ContentWrapper>
        </div>
    );
};

export default FestivalSentiment;
