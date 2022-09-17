import styles from './AwarenessOverview.module.scss';

import { range } from 'lodash';
import Image from 'next/image';
import type { ReactElement, ReactNode } from 'react';
import BHeartSvg from 'components/common/BHeartSvg';
import ContentWrapper from 'components/common/ContentWrapper';

const Title = ({ children, className }: { children: ReactNode, className?: string }): ReactElement => (
    <div className={`font-display text-[#ffe698] text-3xl font-bold mt-7 ${className ?? ''}`}>
        {children}
    </div>
);

const SmallerTitle = ({ children, className }: { children: ReactNode, className?: string }): ReactElement => (
    <div className={`font-display text-[#ffe698] text-xl font-bold mt-7 ${className ?? ''}`}>
        {children}
    </div>
);

const TextBlock = ({ children, className }: { children: ReactNode, className?: string }): ReactElement => (
    <div className={`text-white text-lg md:text-xl ${className ?? ''}`}>
        {children}
    </div>
);

const InfoBox = ({ infoNumber, children, className }: { infoNumber: number, children: ReactNode, className?: string }): ReactElement => (
    <div className={`${styles.infoBox ?? ''} ${className ?? ''}`}>
        <div className={`font-display ${styles.infoBoxNumber ?? ''}`}>{infoNumber}</div>
        <div className={`text-lg md:text-xl ${styles.infoBoxContents ?? ''}`}>{children}</div>
        <div className={styles.infoBoxBackground} />
    </div>
);

const HeartSeparator = ({ className }: { className?: string }): ReactElement => (
    <div className={`flex gap-7 mt-9 justify-center ${className ?? ''}`}>
        {range(9).map(index => (
            <div
                key={index}
                className={index > 4 ? 'hidden md:block' : undefined}
            >
                <BHeartSvg size={22} color="#ffe698" />
            </div>
        ))}
    </div>
);

const AwarenessOverview = (): ReactElement => {

    return (
        <div className="bg-[#e1017e] pt-52 pb-11">
            <div className="md:max-w-5xl md:mx-auto">
                <Image
                    src="/assets/images/festival/awareness-title.png"
                    width={3508}
                    height={993}
                    layout="responsive"
                />
            </div>

            <ContentWrapper>
                <div className="px-4">
                    <Title>
                        Ansprech&shy;personen
                    </Title>

                    <TextBlock className="mt-7">
                        Auf dem B-Side Festival wird es ein Awareness-Team geben. Wir helfen dir, wenn
                        Menschen dich bedrängen oder beleidigen. Auch wenn du dich aus anderen Grünen
                        unwohl fühlst, ist das Awareness-Team für dich da!
                    </TextBlock>

                    <TextBlock className="mt-4">
                        Du erkennst das Awareness-Team an neon-pinken Westen. Du kannst die Menschen jederzeit
                        ansprechen! Du kannst das Awareness-Team während des Festivals* unter dieser Nummer erreichen:
                    </TextBlock>

                    <TextBlock className="text-[#ffe698] leading-4 mt-3">
                        01771572053<br />
                        während des Festivals hier sichtbar
                    </TextBlock>

                    <TextBlock className="mt-4">
                        * Erreichbarkeit garantiert:<br />
                        Freitag, 16.09., 18:00 – 22:00<br />
                        Samstag, 17.09., 14:00 – 04:00<br />
                        Sonntag, 18.09., 14:00 – 17:00
                    </TextBlock>

                    <SmallerTitle>
                        English
                    </SmallerTitle>

                    <TextBlock className="mt-4">
                        There will be an awareness team at the B-Side Festival. We will help you when
                        people harass or insult you. If you feel uncomfortable for other reasons, the
                        awareness team is there for you, too!
                    </TextBlock>

                    <TextBlock className="mt-4">
                        You can recognize the awareness team by their neon pink vests. You can speak to
                        us at any time! You can reach the awareness team during the festival* on this number:
                    </TextBlock>

                    <TextBlock className="text-[#ffe698] leading-4 mt-3">
                        01771572053<br />
                        You can find the number here during the festival
                    </TextBlock>

                    <TextBlock className="mt-4">
                        * Availability guaranteed:<br />
                        Friday, 16.09., 18:00 – 22:00<br />
                        Saturday, 17.09., 14:00 – 04:00<br />
                        Sunday, 18.09., 14:00 – 17:00
                    </TextBlock>

                    <div className="relative">
                        <div className={`mt-12 ${styles.vestImageContainer ?? ''}`}>
                            <Image
                                src="/assets/images/festival/weste.jpg"
                                width={1990}
                                height={1024}
                                layout="responsive"
                                className={styles.vestImage}
                            />
                        </div>
                    </div>

                    <HeartSeparator className="mt-9" />

                    <Title>
                        Wichtig zu wissen
                    </Title>

                    <TextBlock className="mt-7">
                        Auf dem B-Side Festival sollen sich alle Menschen sicher und wohl
                        fühlen. Was für einzelne Menschen dazu beiträgt, sich sicher oder
                        unsicher zu fühlen, ist jedoch von Person zu Person verschieden.
                        Auch unsere individuellen Erfahrungen mit Übergriffen und
                        Diskriminierungen unterscheiden sich grundlegend.
                    </TextBlock>

                    <TextBlock className="mt-4">
                        Deswegen bitten wir dich, an folgende Dinge zu denken:
                    </TextBlock>

                    <InfoBox infoNumber={1} className="mt-9">
                        Persönliche Grenzen sind individuell und subjektiv. Sie zu achten
                        und zu respektieren sollte selbstverständlich sein! Nur ein ganz
                        klares Ja heißt Ja. Frag lieber einmal zu viel als zu wenig nach.
                    </InfoBox>

                    <InfoBox infoNumber={2} className="mt-9">
                        Grenzüberschreitungen passieren alltäglich (Ja, leider auch auf
                        alternativen Festivals in Münster) und betreffen oft Personen,
                        die von existierenden gesellschaftlichen Machtverhältnissen bereits
                        diskriminiert werden. Sexismus und sexualisierte Gewalt, LGBTQ*-feindlichkeit,
                        Rassismus, Ableismus und Antisemitismus sind nur einige Beispiele
                        für Diskriminierungsformen, die Menschen erleben müssen und die
                        wir nicht tolerieren!
                    </InfoBox>

                    <InfoBox infoNumber={3} className="mt-9">
                        Alle Beteiligten des Festivals (Gäste, Veranstalter*innen, Artists etc.)
                        sind für ein diskriminierungsfreies und sicheres Miteinander verantwortlich.
                    </InfoBox>

                    <HeartSeparator className="mt-9" />

                    <TextBlock className="mt-7">
                        Was du tun kannst, wenn du Grenzüberschreitung oder diskriminierendes
                        Verhalten beobachtest oder erlebst:
                    </TextBlock>

                    <InfoBox infoNumber={1} className="mt-9">
                        Dich selbst und/oder den betroffenen Menschen in Sicherheit bringen. Versuche
                        dabei zu vermeiden, fremden Menschen ungefragt zu helfen. Frage Betroffene, ob
                        du einschreiten sollst. Im Fokus stehen die Bedürfnisse von Betroffenen, nicht
                        die Täter*innen.
                    </InfoBox>

                    <InfoBox infoNumber={2} className="mt-9">
                        <u>Awareness-Team</u> ansprechen. Im öffentlichen Bereich des Festivals und
                        auf unseren Partys sind Menschen mit neon-pinken Warnwesten unterwegs. Sie
                        helfen dir aus unangenehmen Situationen, hören dir zu, bringen dich an einen
                        sicheren Ort und vermitteln dir weitere Unterstützung.
                    </InfoBox>

                    <InfoBox infoNumber={3} className="mt-9">
                        <u>Awareness-Telefon</u> anrufen. Solltest du keinen Menschen aus dem
                        Awareness-Team sehen, kannst du jederzeit <span className="text-[#ffe698]">************</span> (wird während des
                        Festivals hier sichtbar) anrufen. Menschen werden sich dann schnellstmöglich
                        auf den Weg zu dir machen oder dir sagen, wo ihr euch in Sicherheit treffen könnt.
                    </InfoBox>

                    <InfoBox infoNumber={4} className="mt-9">
                        <u>Awareness-Treffpunkt</u> aufsuchen. In der Dortmunder Straße 25 findest
                        du am Freitag, 16.09., und am Samstag, 17.09., zwischen 18:00 und 22:00 Uhr
                        Ansprechpersonen und einen sicheren Ort zum Reden und Ausruhen.
                    </InfoBox>

                    <HeartSeparator className="mt-14" />

                    <TextBlock className="mt-9">
                        Wichtig: Das Awareness-Team ersetzt nicht die Arbeit des Rettungsdiensts.
                        In gesundheitlichen Notfällen bitten wir euch 112 anzurufen.
                    </TextBlock>

                    <TextBlock className="mt-7">
                        Hast du Fragen oder Anregungen bezüglich der Festival-Awareness oder
                        möchtest im Awareness-Team mithelfen? Dann schreib uns eine E-Mail
                        an <a href="mailto:willkommen@b-side.ms" className="text-[#ffe698]">willkommen@b-side.ms</a>.
                    </TextBlock>
                </div>
            </ContentWrapper>
        </div>
    );
};

export default AwarenessOverview;
