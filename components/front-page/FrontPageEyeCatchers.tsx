import styles from './FrontPageEyeCatchers.module.scss';

import { useSession } from 'next-auth/react';
import type { ReactElement } from 'react';
import Button from 'components/common/Button';
import ContentWrapper from 'components/common/ContentWrapper';
import BHeartGrid from 'components/front-page/BHeartGrid';
import BSideInfo from 'components/front-page/BSideInfo';
import FestivalMovieEyeCatcher from 'components/front-page/FestivalMovieEyeCatcher';

const FrontPageEyeCatchers = (): ReactElement => {

    const { status } = useSession();

    return (
        <div className={styles.eyecatcher}>
            <ContentWrapper>
                <div className="relative">
                    <div className={styles.box}>

                        {status !== 'authenticated' ? (
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
                        ) : (
                            <div className={`${styles.boxContent ?? ''} space-y-2`}>
                                <div className={`${styles.title ?? ''} font-display`}>
                                    Jetzt bewerben für das B-Side Festival 2023
                                </div>

                                <div>
                                    Unter dem Motto "Interaktion Reaktion" findet auch in diesem Jahr das
                                    B-Side Festival statt. Am <strong>15. und 16.09.</strong> möchten
                                    wir erneut einen Raum für Kunst und Kultur im Viertel schaffen. Wenn
                                    auch ihr mit eurer Musik, Ausstellung, Workshop, Performance oder sonst
                                    wie Teil davon sein möchtet, bewerbt euch bei uns!
                                </div>

                                <Button href="/bewerbungen">zur Bewerbung</Button>
                            </div>
                        )}

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

            <FestivalMovieEyeCatcher />

            <BSideInfo />
        </div>
    );
};

export default FrontPageEyeCatchers;
