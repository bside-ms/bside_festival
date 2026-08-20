import AwarenessSectionHeading from '@/components/awareness/AwarenessSectionHeading';
import { awarenessPhone } from '@/lib/public/awareness';
import type { ReactElement } from 'react';

const AwarenessInformation = (): ReactElement => {
    return (
        <>
            <section>
                <AwarenessSectionHeading>Ansprechpersonen während des Festivals:</AwarenessSectionHeading>
                <p>
                    Auf dem B-Side Festival wird es ein Awareness-Team geben. Das Team hilft dir, wenn Menschen dich belästigen, übergriffig
                    werden, beleidigen oder du dich aus anderen Gründen diskriminiert oder unwohl fühlst.
                </p>
                <ul className="mt-3 list-outside list-disc space-y-2 pl-7">
                    <li>Du erkennst das Awareness-Team an neon-pinken Westen</li>
                    <li>Du kannst das Awareness-Team jederzeit ansprechen, wenn du dich unwohl fühlst oder Fragen hast</li>
                    <li>Das Awareness-Team kann dich jederzeit zu einem ruhigeren Rückzugsort begleiten</li>
                    <li>
                        Awareness-Telefon: <strong>{awarenessPhone}</strong>
                    </li>
                </ul>
            </section>

            <section>
                <AwarenessSectionHeading>
                    Unser Awareness-Konzept gegen Diskriminierung, Gewalt und Grenzüberschreitung
                </AwarenessSectionHeading>
                <div className="space-y-3">
                    <p>
                        Wir möchten einen rücksichtsvollen, verantwortungsbewussten und solidarischen Umgang miteinander etablieren und
                        pflegen. Wir vertreten dabei eine Haltung und Praxis, die Diskriminierung und Gewalt entgegenwirkt und sich auf
                        konsensbasiertes Handeln stützt. Dafür haben wir eigene Richtlinien entwickelt, die während der Festivalzeit für
                        alle gelten. Alle an dem Festival beteiligten Personen können so Verantwortung für sich selbst und den geteilten
                        Raum übernehmen. Jegliche Form der Diskriminierung oder Grenzüberschreitung oder Verhalten zum Nachteil anderer
                        Menschen wird in der B-Side nicht toleriert.
                    </p>
                    <p>
                        Über allem steht die Parteilichkeit mit Betroffenen als Grundsatz unserer Awareness-Arbeit. Das bedeutet, dass wir
                        keine künstliche Neutralität wahren, sondern solidarisch an der Seite der von Gewalt oder Diskriminierung
                        Betroffenen stehen und deren Perspektive, Bedürfnisse und Rechte in den Mittelpunkt stellen und nicht anzweifeln.
                    </p>
                    <p>Daher bitten wir dich, auf folgende Dinge zu achten:</p>
                </div>
                <ol className="mt-3 list-outside list-decimal space-y-3 pl-7">
                    <li>
                        Persönliche Grenzen sind individuell und subjektiv. Sie zu achten und zu respektieren ist wichtig. Nur ein klares
                        „Ja“ heißt „Ja“. Frag lieber einmal zu viel als zu wenig nach. Wir bitten dich, auch dein Oberteil anzubehalten, um
                        niemand in eine unangenehme Situation zu bringen.
                    </li>
                    <li>
                        Wir tolerieren kein grenzüberschreitendes oder diskriminierendes Verhalten und werden, wenn möglich, dagegen
                        vorgehen. Grenzüberschreitungen und Diskriminierung passieren leider überall und alltäglich. Es gibt keinen
                        (öffentlichen) Raum der frei davon ist. Diskriminierung bedeutet, (strukturelle) Benachteiligung, Herabwürdigung und
                        Ungleichbehandlung aufgrund von Herkunft, Klasse, Geschlecht, Alter, Gesundheit, Sexualität, Hautfarbe oder Besitz.
                        Grenzüberschreitung kann ein unangenehmer Spruch sein, eine ungewollte Berührung, eine zu persönliche Frage oder
                        Ausgrenzung.
                    </li>
                    <li>
                        Zeig Verständnis, Anerkennung und Achtung für Dinge, Praktiken oder Traditionen von Kulturen. Wir möchten keine
                        Aneignung oder Instrumentalisierung kultureller, religiöser und politischer Symbole. Außerdem gilt:{' '}
                        <span className="font-bold text-[#e23b3b]">Nazis müssen draußen bleiben.</span>
                    </li>
                    <li>
                        Schließe nicht von Äußerlichkeiten auf Geschlechtsidentitäten. Frage nach den Pronomen („they, dey, name, sie, er,
                        name“), mit denen die Person angesprochen werden möchte.
                    </li>
                    <li>
                        Selfcare (Selbstfürsorge) ist ein wichtiger Grundsatz in der Awareness-Arbeit. Wenn du dich unsicher fühlst,
                        kommuniziere das mit deinen Friends. Schütze dein Getränk vor K.O. Tropfen, indem du den Flaschendeckel
                        weiterverwendest oder dein Getränk immer festhältst und im Blick hast.
                    </li>
                </ol>
            </section>

            <section>
                <AwarenessSectionHeading>
                    Was du tun kannst, wenn du Grenzüberschreitung oder diskriminierendes Verhalten beobachtest oder erlebst:
                </AwarenessSectionHeading>
                <ul className="list-outside list-disc space-y-2 pl-7">
                    <li>
                        Solidarisiere dich mit Betroffenen. Biete deine Hilfe an, höre zu und erkenne die geschilderte Perspektive an und
                        stelle sie nicht in Frage. Im Fokus stehen immer die Bedürfnisse der betroffenen Personen.
                    </li>
                    <li>
                        Spreche das Awareness-Team an. Es ist an den pinken Westen zu erkennen. Du kannst auch die Awareness-Anlaufstelle
                        (Infostand) an der Theke oder bei den Ordner*innen nach der Awareness fragen oder ruf das Team an. Telefonnummer:{' '}
                        <strong>{awarenessPhone}</strong>
                    </li>
                </ul>
                <p className="mt-4 font-bold">
                    <span className="text-[#e23b3b]">Wichtig:</span> Das Awareness-Team ersetzt nicht den Rettungsdienst.{' '}
                    <span className="text-[#e23b3b]">In Notfällen, die Gesundheit betreffen, bitten wir euch 112 anzurufen.</span>
                </p>
            </section>

            <section>
                <AwarenessSectionHeading>Kinder &amp; Jugendliche</AwarenessSectionHeading>
                <div className="space-y-3">
                    <p>
                        Es gibt kein explizites Kinder- und Jugendschutzkonzept. Die B-Side bietet nicht per se einen sicheren Raum für
                        Kinder und Jugendliche. Wir bitten Eltern, ihre Kinder während des gesamten Besuchs in der B-Side zu betreuen, zu
                        begleiten und im Blick zu haben. Einige Auftritte können explizite Inhalte enthalten, die Erziehungsberechtigten
                        haben die Sorge zu tragen, die Zumutbarkeit für Kinder und Jugendliche einzuschätzen und dementsprechend zu handeln.
                        Es gelten ansonsten die folgenden gesetzlichen Regelungen:
                    </p>
                    <p>
                        <span className="font-bold">Aufenthaltszeiten:</span> Unter 16jährige dürfen unsere Partys und Konzerte nicht
                        besuchen, außer sie werden von ihren Eltern oder einer erziehungsbeauftragten Person begleitet und betreut.
                        Jugendliche ab 16 Jahren dürfen auch allein an unseren Partys und Konzerten bis 24:00 Uhr teilnehmen. Wollen sie
                        dort länger bleiben, dürfen sie das nur in Begleitung der Eltern oder einer erziehungsbeauftragten Person, die die
                        Verantwortung übernimmt. Die erziehungsbeauftragte Person wird mit einem „Mutti-Zettel“ von den Eltern bestimmt.
                    </p>
                    <p>
                        <span className="font-bold">Rauchen:</span> Jugendliche unter 18 Jahren dürfen in der Öffentlichkeit nicht rauchen
                        und keine Tabakwaren kaufen.
                    </p>
                    <p>
                        <span className="font-bold">Alkohol:</span> Alkohol darf in der Öffentlichkeit grundsätzlich an unter 18-Jährige
                        nicht abgegeben werden. Auch der Konsum von Alkohol ist in der Öffentlichkeit Kindern und Jugendlichen unter 18
                        Jahren verboten. Bier, Sekt, Wein und deren Mischgetränke dürfen an Jugendliche über 16 Jahren abgegeben werden und
                        von ihnen konsumiert werden.
                    </p>
                </div>
            </section>
        </>
    );
};

export default AwarenessInformation;
