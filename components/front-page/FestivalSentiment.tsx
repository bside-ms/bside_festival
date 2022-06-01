import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import FestivalImageGrid from 'components/front-page/FestivalImageGrid';

const FestivalSentiment = (): ReactElement => {

    return (
        <div className="bg-[#3eb0e3] py-10 px-5">
            <ContentWrapper>
                <div className="text-white font-display text-3xl mb-5 text-center">
                    Ein Festival<br />
                    von Allen<br />
                    für Alle
                </div>

                <FestivalImageGrid />
            </ContentWrapper>
        </div>
    );
};

export default FestivalSentiment;
