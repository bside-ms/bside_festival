import styles from './ApplicationEyecatcher.module.scss';

import type { ReactElement } from 'react';
import Button from 'components/Button';
import ContentWrapper from 'components/ContentWrapper';

const ApplicationEyecatcher = (): ReactElement => {

    return (
        <div className={styles.eyecatcher}>
            <ContentWrapper>
                <div className={styles.box}>
                    <div className={`${styles.boxContent} space-y-5`}>
                        <div className={`${styles.title} font-display`}>
                            Zurück für die Zukunft!
                        </div>

                        <div className={`${styles.info} font-bold`}>
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
            </ContentWrapper>
        </div>
    );
};

export default ApplicationEyecatcher;
