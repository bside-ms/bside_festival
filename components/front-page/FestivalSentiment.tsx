import type { ReactElement } from 'react';
import FestivalImageGrid from 'components/front-page/FestivalImageGrid';

const FestivalSentiment = (): ReactElement => {

    return (
        <div className="bg-[#3eb0e3] py-10 px-5">
            <div className="text-white font-display text-3xl mb-5 text-center">
                Ein Festival<br />
                für Alle
            </div>

            <FestivalImageGrid />
        </div>
    );
};

export default FestivalSentiment;
