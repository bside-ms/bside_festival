import styles from './ApplicationEyecatcher.module.scss';

import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import BHeartGrid from 'components/front-page/BHeartGrid';

const ApplicationEyecatcher = (): ReactElement => {

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

                            <div className={styles.info}>
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
                <div className={styles.applicationBox}>
                    <div className="font-display text-1xl mb-3">Ende der Bewerbungsphase</div>

                    <div className={styles.applicationBoxInfo}>
                        Unsere Bewerbungsphase für das B-Side Festival 2022 ist beendet. <strong>Vielen Dank für alle Einsendungen!</strong> Wir sind
                        überwältigt von der Vielzahl an Menschen, die dieses schöne Festival mitgestalten wollen und machen uns nun an die Sichtung
                        aller eurer Bewerbungen. Bitte gebt uns etwas Zeit, bis wir uns bei euch melden. Wir sind fleißig dabei, ein abwechslungsreiches,
                        unterhaltsames und schönes Programm zu erstellen.<br />
                        Wir freuen uns!
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default ApplicationEyecatcher;
