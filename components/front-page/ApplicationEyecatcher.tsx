import styles from './ApplicationEyecatcher.module.scss';

import type { ReactElement } from 'react';
import Button from 'components/Button';

const ApplicationEyecatcher = (): ReactElement => {

    return (
        <div className={styles.eyecatcher}>
            <div className={styles.box}>
                <div className={`${styles.boxContent} space-y-5`}>
                    <div className={`${styles.title} font-display`}>
                        ZURÜCK FÜR DIE ZUKUNFT!
                    </div>

                    <div className={`${styles.info} font-bold`}>
                        Du willst mitmachen? Super! Dann bewirb dich jetzt!
                    </div>

                    <Button
                        href="/bewerbung"
                        label="Jetzt bewerben!"
                    />
                </div>

                <div className={styles.boxBackground} />
                <div className={styles.boxBackgroundLayer} />
                <div className={styles.offsetBackgroundLayer1} />
                <div className={styles.offsetBackgroundLayer2} />
            </div>
        </div>
    );
};

export default ApplicationEyecatcher;
