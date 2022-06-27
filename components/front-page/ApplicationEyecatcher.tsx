import styles from './ApplicationEyecatcher.module.scss';

import type { ReactElement } from 'react';
import Button from 'components/common/Button';
import ContentWrapper from 'components/common/ContentWrapper';
import BHeartGrid from 'components/front-page/BHeartGrid';
import useLatestApplicationEndDate from 'lib/application-form/useLatestApplicationEndDate';
import useFormattedDate from 'lib/common/useFormattedDate';

const ApplicationEyecatcher = (): ReactElement => {

    const latestApplicationEndDate = useFormattedDate(useLatestApplicationEndDate(), 'd. MMMM');

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
                    <div className="font-display text-2xl mb-3">Bewerbung</div>

                    <div className={styles.applicationBoxInfo}>
                        Du willst mit deiner Kunst Teil des bunten Programms werden? Du wohnst im Viertel
                        und willst zum Beispiel deinen Hinterhof als Veranstaltungsort zur Verfügung
                        stellen? Du bietest mit deinem Foodtruck leckeres vegan-vegetarisches Essen an?
                        Du hast eine spannende Idee, auf die wir bisher noch gar nicht gekommen sind?
                        Super! Dann bewirb dich noch <span className="font-bold">bis zum {latestApplicationEndDate}</span>!
                    </div>

                    <div className="mt-7">
                        <Button href="/bewerbung">
                            Jetzt bewerben!
                        </Button>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default ApplicationEyecatcher;
