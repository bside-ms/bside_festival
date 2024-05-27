import Image from 'next/image';
import type { ReactElement } from 'react';
import team1Picture from '../../public/assets/images/festival/team1.jpg';
import team2Picture from '../../public/assets/images/festival/team2.jpg';
import ContentWrapper from 'components/common/ContentWrapper';

const TeamImageEyeCatcher = (): ReactElement => {
    return (
        <div className="bg-[#3eb0e3] px-5 py-10">
            <ContentWrapper>
                <div className="flex flex-col gap-3 bg-gradient-to-b from-[#2c9fc9] to-[#e1017e] px-[40px] py-[25px] text-white">
                    <div className="group">
                        <div className="group-hover:hidden">
                            <Image
                                src={team1Picture}
                                width={2992}
                                height={2607}
                                layout="responsive"
                                priority={true}
                                placeholder="blur"
                                alt="Festival-Team"
                            />
                        </div>
                        <div className="hidden group-hover:block">
                            <Image
                                src={team2Picture}
                                width={2992}
                                height={2607}
                                layout="responsive"
                                priority={true}
                                placeholder="blur"
                                alt="Festival-Team"
                            />
                        </div>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default TeamImageEyeCatcher;
