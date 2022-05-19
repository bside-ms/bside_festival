import styles from './ApplicationEyecatcher.module.scss';

import type { ReactElement } from 'react';
import Button from 'components/common/Button';
import ContentWrapper from 'components/common/ContentWrapper';
import BHeartGrid from 'components/front-page/BHeartGrid';

const ApplicationEyecatcher = (): ReactElement => {

    return (
        <div className={styles.eyecatcher}>
            <ContentWrapper>
                <div className={styles.box}>
                    <div className={`${styles.boxContent} space-y-5`}>
                        <div>
                            Endlich geht es wieder los: Das B-Side Festival ist kehrt zurück
                        </div>

                        <div className={`${styles.title} font-display`}>
                            Zurück für die Zukunft!
                        </div>

                        <div className={styles.info}>
                            Du willst mitmachen? Super! Dann bewirb dich jetzt!
                        </div>

                        <Button href="/bewerbung">
                            Jetzt bewerben!
                        </Button>
                    </div>

                    <div className={styles.boxBackground} />
                    <div className={styles.boxBackgroundLayer} />
                    <div className={styles.offsetBackgroundLayer1} />
                    <div className={styles.offsetBackgroundLayer2} />
                </div>

                <div className="absolute bottom-[-70px] -margin-y-4 right-4 z-10">
                    <BHeartGrid />
                </div>
            </ContentWrapper>
        </div>
    );
};

export default ApplicationEyecatcher;
