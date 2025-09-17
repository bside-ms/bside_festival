import AwarenessAlternativeLinks from '@/components/awareness/AwarenessAlternativeLinks';
import Link from 'next/link';
import type { ReactElement } from 'react';

const AwarenessInformation = (): ReactElement => {
    return (
        <div className="flex flex-col gap-5 bg-white/50 p-4">
            <AwarenessAlternativeLinks />

            <div>
                <div className="mb-1 text-lg font-bold">Barrieren</div>
                <div className="space-y-2">
                    <div>
                        <span className="underline">Eingang:</span> Am Mittelhafen 42 ist unser Eingang: Straßenseitig gibt es einen Zugang
                        zum EG (Rampe, barrierefrei) oder über die große Wendeltreppe (nicht barrierefrei) zum 1. OG. Es gibt links neben
                        dem Eingang einen Aufzug für Menschen, die die Treppe nicht benutzen können.
                    </div>
                    <div>
                        <span className="underline">Ausgang:</span> Wasserseitig über die große Hafentreppe von der Dachterrasse aus.
                        Menschen, die barrierefreie Zu- und Ausgänge brauchen, dürfen auch den Aufzug benutzen.
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-1 text-lg font-bold">Toiletten</div>
                <div className="space-y-2">
                    <div>
                        Im 1. OG und im EG gibt es barrierefreie Toiletten. Es gibt nur Unisex-Toiletten, bei denen die Ausstattung
                        beschrieben wird (Sitz- und/oder Stehklos). Bitte nehmt Rücksicht auf FLINTA*-Personen. Das (selbstgewählte)
                        Geschlecht von anderen lässt sich nicht an Äußerlichkeiten ablesen:{' '}
                        <span className="italic">Gender has no looks!</span>
                    </div>
                    <div>
                        <span className="underline">Plan B:</span> Das Plan B hat drei Stufen am Eingang.
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-1 text-lg font-bold">Ansprechpersonen während des Festivals</div>

                <div>
                    Auf dem B-Side Festival wird es ein <strong>Awareness-Team</strong> geben. Das Team hilft dir, wenn Menschen dich
                    belästigen, beleidigen oder du dich aus anderen Gründen diskriminiert oder unwohl fühlst.
                </div>
            </div>

            <div>
                <ul className="list-outside list-disc space-y-2 pl-7">
                    <li className="pl-2">Du erkennst das Awareness-Team an neon-pinken Westen.</li>
                    <li className="pl-2">Du kannst die Menschen jederzeit ansprechen, wenn du dich unwohl fühlst oder Fragen hast.</li>
                    <li className="pl-2">Das Awareness-Team kann dich jederzeit an einen Rückzugsort begleiten.</li>
                    <li className="pl-2">Awareness-Telefon: 0176 25050139</li>
                </ul>
            </div>

            <div>
                <div className="mb-1 text-lg font-bold">Unser Awareness-Konzept gegen Diskriminierung, Gewalt und Grenzüberschreitung</div>
                Wir möchten einen rücksichtsvollen, verantwortungsbewussten und solidarischen Umgang miteinander etablieren und pflegen. Wir
                vertreten dabei eine Haltung und Praxis, die Diskriminierung und Gewalt entgegenwirkt und sich auf konsensbasiertes Handeln
                stützt. Dafür haben wir eigene Richtlinien entwickelt, die während der Festivalzeit für alle gelten. Alle am Festival
                beteiligten Personen können so Verantwortung für sich selbst und den geteilten Raum übernehmen. Jegliche Form von
                Diskriminierung, Grenzüberschreitung oder Verhalten zum Nachteil anderer Menschen wird in der B-Side nicht toleriert.
            </div>

            <div>
                <div className="mb-2">Daher bitten wir dich, auf folgende Dinge zu achten:</div>

                <div>
                    <ol className="list-outside list-decimal space-y-2 pl-7">
                        <li className="pl-2">
                            Persönliche Grenzen sind individuell und subjektiv. Sie zu achten und zu respektieren ist wichtig. Nur ein
                            klares „Ja“ heißt „Ja“. Frag lieber einmal zu viel als zu wenig nach. Wir bitten dich, auch dein Oberteil
                            anzubehalten, um niemanden in eine unangenehme Situation zu bringen.
                        </li>
                        <li className="pl-2">
                            Grenzüberschreitungen und Diskriminierung passieren überall und alltäglich. Es gibt keinen (öffentlichen) Raum,
                            der frei davon ist. Diskriminierung bedeutet, (strukturelle) Benachteiligung, Herabwürdigung und
                            Ungleichbehandlung aufgrund von Herkunft, Klasse, Geschlecht, Alter, Gesundheit, Sexualität, Hautfarbe oder
                            Besitz. Grenzüberschreitung kann ein unangenehmer Spruch sein, eine ungewollte Berührung, eine zu persönliche
                            Frage oder Ausgrenzung. Wir tolerieren dieses Verhalten nicht und werden, wenn möglich, dagegen vorgehen.
                        </li>
                        <li className="pl-2">
                            Zeig Verständnis, Anerkennung und Achtung für Dinge, Praktiken oder Traditionen von Kulturen. Wir möchten keine
                            Aneignung oder Instrumentalisierung kultureller, religiöser und politischer Symbole.
                        </li>
                        <li className="pl-2">
                            Schließe nicht von Äußerlichkeiten auf Geschlechteridentitäten. Frage nach den Pronomen („they“, „dey“, „sie“,
                            „er“, „name“), mit denen die Person angesprochen werden möchte.
                        </li>
                        <li className="pl-2">
                            Selfcare (Selbstfürsorge) ist ein wichtiger Grundsatz in der Awareness-Arbeit. Wenn du dich unsicher fühlst,
                            kommuniziere das mit deinen Friends. Schütze dein Getränk vor K.-o.-Tropfen, indem du den Flaschendeckel
                            weiterverwendest oder dein Getränk immer festhältst und im Blick hast.
                        </li>
                    </ol>
                </div>
            </div>

            <div>
                <div className="mb-2 font-bold underline">
                    Was du tun kannst, wenn du Grenzüberschreitung oder diskriminierendes Verhalten beobachtest oder erlebst:
                </div>

                <div>
                    <ul className="list-outside list-disc space-y-2 pl-7">
                        <li className="pl-2">
                            Solidarisiere dich mit Betroffenen. Biete deine Hilfe an, höre zu und erkenne die geschilderte Perspektive an
                            und stelle sie nicht in Frage. Im Fokus stehen immer die Bedürfnisse der betroffenen Personen.
                        </li>
                        <li className="pl-2">
                            Sprich das Awareness-Team an. Es ist an den pinken Westen zu erkennen. Du kannst auch an der
                            Awareness-Anlaufstelle, an der Theke oder bei den Ordner*innen nach der Awareness fragen oder das Team anrufen.
                        </li>
                    </ul>
                    <div className="mt-2">Telefonnummer: 0176 25050139</div>
                </div>
            </div>

            <div className="italic">
                Wichtig: Das Awareness-Team ersetzt nicht den Rettungsdienst. In Notfällen, die die Gesundheit betreffen, bitten wir euch
                112 anzurufen.
            </div>

            <div>
                <div className="mb-1 text-lg font-bold">Kinder & Jugendliche</div>
                <div className="space-y-2">
                    <div>
                        Es gibt kein explizites Kinder- und Jugendschutzkonzept. Die B-Side bietet nicht per se einen sicheren Raum für
                        Kinder und Jugendliche. Wir bitten Eltern, ihre Kinder während des gesamten Besuchs in der B-Side im Blick zu haben
                        und zu betreuen. Es gelten ansonsten die gesetzlichen Regelungen:
                    </div>
                    <div>
                        <span className="underline">Aufenthaltszeiten:</span> Kinder und Jugendliche unter 16 Jahren dürfen unsere Partys
                        und Konzerte nicht besuchen, außer sie werden von ihren Eltern oder einer erziehungsbeauftragten Person begleitet
                        und betreut. Jugendliche ab 16 Jahren dürfen auch allein an unseren Partys und Konzerten bis 24.00 Uhr teilnehmen.
                        Wollen sie dort länger bleiben, dürfen sie das nur in Begleitung der Eltern oder einer erziehungsbeauftragten
                        Person, die die Verantwortung übernimmt. Die erziehungsbeauftragte Person wird mit einem „Mutti-Zettel“ von den
                        Eltern bestimmt. Die gesetzlichen Aufenthaltszeiten von Jugendlichen werden vom Security-Personal sichergestellt und
                        garantiert.
                    </div>
                    <div>
                        <span className="underline">Rauchen:</span> Jugendliche unter 18 Jahren dürfen in der Öffentlichkeit nicht rauchen
                        und keine Tabakwaren kaufen.
                    </div>
                    <div>
                        <span className="underline">Alkohol:</span> Alkohol darf in der Öffentlichkeit grundsätzlich an unter 16-Jährige
                        nicht abgegeben werden. Auch der Konsum von Alkohol ist in der Öffentlichkeit Kindern und Jugendlichen unter 16
                        Jahren verboten. Bier, Sekt, Wein und deren Mischgetränke dürfen an Jugendliche über 16 Jahren abgegeben werden und
                        von ihnen konsumiert werden.
                    </div>
                </div>
            </div>

            <AwarenessAlternativeLinks />

            <div>
                Hast du Fragen oder Anregungen bezüglich der Festival-Awareness oder möchtest im Awareness-Team mithelfen? Dann schreib uns
                eine E-Mail an{' '}
                <Link className="underline" href="mailto:willkommen@b-side.ms">
                    willkommen@b-side.ms
                </Link>
                .
            </div>
        </div>
    );
};

export default AwarenessInformation;
