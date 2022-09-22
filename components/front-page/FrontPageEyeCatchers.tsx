import styles from './FrontPageEyeCatchers.module.scss';

import Image from 'next/image';
import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import BHeartGrid from 'components/front-page/BHeartGrid';
import BSideInfo from 'components/front-page/BSideInfo';

const FrontPageEyeCatchers = (): ReactElement => {

    return (
        <div className={styles.eyecatcher}>
            <ContentWrapper>
                <div className="relative">
                    <div className={styles.box}>
                        <div className={`${styles.boxContent ?? ''} space-y-2`}>
                            <div className={`${styles.title ?? ''} font-display`}>
                                Das B-Side Festival-Team sagt Danke!
                            </div>

                            <div>
                                Danke an alle ehrenamtlichen Helfer:innen, an alle Unterstützenden
                                aus dem Viertel und aus der B-Side. Danke an alle, die sich beworben
                                haben und danke an alle, die dieses unfassbar vielfältige Programm
                                mitgestaltet haben. Danke an alle Locations und Kooperationspartner:innen.
                                Und natürlich Danke an alle Menschen, die unser Festival besucht haben!
                                Wir sind unfassbar glücklich, dass dieses Wochenende dank euch allen
                                möglich war.
                            </div>
                        </div>

                        <div className={styles.boxBackground} />
                        <div className={styles.boxBackgroundLayer} />
                        <div className={styles.offsetBackgroundLayer1} />
                        <div className={styles.offsetBackgroundLayer2} />
                    </div>

                    <div className="absolute bottom-[-56px] right-[10px] z-10">
                        <BHeartGrid />
                    </div>
                </div>
            </ContentWrapper>

            <ContentWrapper>
                <div className="flex flex-col gap-3 mt-[40px] py-[25px] px-[40px] bg-gradient-to-b from-[#2c9fc9] to-[#e1017e] text-white">
                    <div className="group">
                        <div className="group-hover:hidden">
                            <Image
                                src="/assets/images/festival/team1.jpg"
                                width={2992}
                                height={2607}
                                layout="responsive"
                            />
                        </div>
                        <div className="hidden group-hover:block">
                            <Image
                                src="/assets/images/festival/team2.jpg"
                                width={2992}
                                height={2607}
                                layout="responsive"
                            />
                        </div>
                    </div>
                    <div>
                        Bald findet ihr an dieser Stelle viele tolle Fotos und noch mehr vom Festival! Also schaut
                        bald mal wieder vorbei!
                    </div>
                </div>
            </ContentWrapper>

            <BSideInfo />
        </div>
    );
};

export default FrontPageEyeCatchers;
