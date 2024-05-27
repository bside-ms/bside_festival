import type { ReactElement } from 'react';
import YouTube from 'react-youtube';
import ContentWrapper from 'components/common/ContentWrapper';

const FestivalMovieEyeCatcher = (): ReactElement => {
    return (
        <ContentWrapper>
            <div className="mt-[40px] flex flex-col gap-3 bg-gradient-to-b from-[#2c9fc9] to-[#e1017e] px-[40px] py-[25px] text-white">
                <div className="block md:hidden">
                    <YouTube
                        videoId="S-LSXFaUc5Y"
                        opts={{
                            height: '350px',
                            width: '100%',
                        }}
                    />
                </div>

                <div className="hidden md:block">
                    <YouTube
                        videoId="S-LSXFaUc5Y"
                        opts={{
                            height: '500px',
                            width: '100%',
                        }}
                    />
                </div>
            </div>
        </ContentWrapper>
    );
};

export default FestivalMovieEyeCatcher;
