import styles from './BSideInfo.module.scss';

import type { ReactElement } from 'react';
import ContentWrapper from 'components/common/ContentWrapper';
import BHeartGrid from 'components/front-page/BHeartGrid';

const BSideInfo = (): ReactElement => {

    const mailTo = (
        <a href="mailto:kultur@b-side.ms" className="italic whitespace-nowrap">
            kultur@b-side.ms
        </a>
    );

    return (
        <ContentWrapper>
            <div className="relative pt-16 flex justify-end">
                <div className={styles.box}>
                    <div className={`${styles.boxContent ?? ''} space-y-2`}>
                        <div>
                            Der offene <span className="font-display pl-1">B-Side Kultur e.V.</span> veranstaltet in einem umfangreichen
                            soziokulturellen Prozess das B-Side Festival mit ca. 30 Ehrenamtlichen im Orga-Team und ca. 100 freiwilligen
                            Helfer:innen. Daneben gibt es zahlreiche weitere Möglichkeiten sich im gemeinnützigen Programm des
                            Vereins einzubringen: Konzerte, künstlerische Workshops, Ausstellungen, Theater, politische Bildung, eigene Ideen...
                        </div>
                        <div>
                            Ihr möchtet euch engagieren? Dann meldet euch einfach unter {mailTo} oder
                            kommt bei uns Am Hawerkamp 29 vorbei. Ende 2023 wird der B-Side Kultur e.V. wieder in der B-Side Am Mittelhafen
                            42 einziehen. Nach erfolgreicher Sanierung können dort Konzerte und Podiumsdiskussionen, Orga-Treffen und
                            Klima-Workshops, Theaterproben, handwerkliche Bildung uvm. stattfinden. Es entstehen programmatische
                            Freiräume, um auch deine/ eure gemeinnützigen Ideen in den offenen Vereinsstrukturen umzusetzen und
                            große Herausforderungen der Gesellschaft kollektiv anzugehen. Transformative Soziokultur, koproduktiv und nichtkommerziell,
                            für die Allgemeinheit. Bald wieder am alten Ort. <span className="font-display pl-1">Zurück für die Zukunft.</span>
                        </div>
                    </div>

                    <div className={styles.boxBackground} />
                    <div className={styles.boxBackgroundLayer} />
                    <div className={styles.offsetBackgroundLayer1} />
                    <div className={styles.offsetBackgroundLayer2} />
                </div>

                <div className="absolute bottom-[-56px] left-[10px] z-10">
                    <BHeartGrid />
                </div>
            </div>
        </ContentWrapper>
    );
};

export default BSideInfo;
