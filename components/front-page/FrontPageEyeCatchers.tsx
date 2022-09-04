import styles from './FrontPageEyeCatchers.module.scss';

import Link from 'next/link';
import type { ReactElement } from 'react';
import Button from 'components/common/Button';
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
                            <div>
                                Endlich geht es wieder los: Das B-Side Festival kehrt zurück
                            </div>

                            <div className={`${styles.title ?? ''} font-display`}>
                                Zurück für die Zukunft!
                            </div>

                            <div>
                                Nachdem wir 2021 wegen der Corona-Pandemie einen Pause eingelegt haben, freuen wir
                                uns umso mehr auf diesen September. Denn vom 16. bis zum 18.09.2022 werden die
                                Straßen, Kneipen und Hinterhöfe des Hansaviertels wieder mit Kunst, Musik,
                                Workshops und Theater gefüllt.
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
                <div className={`flex flex-col gap-3 ${styles.bigBox ?? ''}`}>
                    <div>
                        Schon sehr bald geht es im Hansaviertel rund! Für unser B-Side Festival 2022
                        „Zurück für die Zukunft“ brauchen wir euch! Wir suchen tatkräftige Helfer*innen. Dabei gibt
                        es verschiedene Aufgaben, bei denen ihr euch einbringen könnt: Die Betreuung von  Konzerten,
                        Workshops, Ausstellungen und Lesungen, die Verpflegung für das Helfer*innen- und B-Side-Team,
                        Hilfe beim Auf- und Abbau und der Technik des Festivals, Unterstützung des Awareness-Teams
                        auf dem gesamten Festival und beim Spendensammeln.
                    </div>
                    <div>
                        Mit allen Stärken und Interessen seid ihr herzlich willkommen uns zu unterstützen! Denn nur
                        mit euch kann das Festival so toll wie die letzten Jahre werden!
                    </div>
                    <div>
                        <Link href="/mithelfen" passHref={true}>
                            <Button>
                                Jetzt mithelfen
                            </Button>
                        </Link>
                    </div>
                </div>
            </ContentWrapper>

            <BSideInfo />
        </div>
    );
};

export default FrontPageEyeCatchers;
