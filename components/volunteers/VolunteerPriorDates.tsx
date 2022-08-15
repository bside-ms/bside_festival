import styles from 'components/volunteers/VolunteerPriorDates.module.scss';

import { addDays, isFuture } from 'date-fns';
import Image from 'next/image';
import type { ReactElement } from 'react';
import formatDate from 'lib/common/formatDate';

const dates = new Array<Date>(
    new Date('2022/08/22 16:00'),
    new Date('2022/09/05 16:00'),
    new Date('2022/09/10 14:00'),
);

const VolunteerPriorDates = (): ReactElement | null => {

    const datesInFuture = dates.filter(date => isFuture(addDays(date, 1)));

    if (datesInFuture.length === 0) {
        return null;
    }

    return (
        <div>
            Und auch schon vor dem Festival könnt ihr uns unterstützen. An folgende
            Terminen dürft ihr super gerne zum Kennenlernen und Deko basteln rumkommen!

            <ul className="list-disc pl-6 mt-1 mb-3">
                {datesInFuture.map(date => {
                    const formattedDate = formatDate(date, 'dd.MM. \'ab\' HH:mm \'Uhr\'');

                    return <li key={formattedDate}>{formattedDate}</li>;
                })}
            </ul>

            Schaut einfach bei uns am Hawerkamp vorbei!<br />
            Wir freuen uns auf euch!

            <div className="relative">
                <div className={`mt-5 ${styles.decorationImageContainer ?? ''}`}>
                    <Image
                        src="/assets/images/festival/decoration.jpg"
                        width={2048}
                        height={1536}
                        layout="responsive"
                        className={styles.decorationImage}
                    />
                </div>
            </div>
        </div>
    );
};

export default VolunteerPriorDates;
