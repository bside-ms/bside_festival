import Link from 'next/link';
import type { ReactElement } from 'react';
import AwarenessAlternativeLinks from 'components/awareness/AwarenessAlternativeLinks';
import awarenessPhoneNumber from 'components/awareness/awarenessPhoneNumber';

const AwarenessInformation = (): ReactElement => {

    return (
        <div className="bg-opacity-50 bg-white p-4 flex flex-col gap-5">
            <div className="text-black font-display">
                <div className="text-2xl">
                    <Link href="/">B-Side Festival 2023</Link>
                </div>
                <div className="text-4xl font-bold">
                    Awareness
                </div>
            </div>

            <AwarenessAlternativeLinks />

            <div>
                <div className="mb-1 underline">
                    Ansprechpersonen während des Festivals:
                </div>

                <div>
                    Auf dem B-Side Festival wird es ein <strong>Awareness-Team</strong> geben. Das Team hilft dir, wenn Menschen
                    dich belästigen, beleidigen oder du dich aus anderen Gründen diskriminiert oder unwohl fühlst.
                </div>
            </div>

            <div>
                <ul className="pl-7 space-y-2 list-outside list-disc">
                    <li className="pl-2">Du erkennst das Awareness-Team an neon-pinken Westen oder Armbinden.</li>
                    <li className="pl-2">Du kannst die Menschen jederzeit ansprechen, wenn du dich unwohl fühlst oder Fragen hast.</li>
                    <li className="pl-2">Du findest Ansprechpersonen an der Awareness-Anlaufstelle vor dem B-Side Gebäude</li>
                    <li className="pl-2">Das Awareness-Team kann dich jederzeit an einen Rückzugsort begleiten</li>
                    <li className="pl-2">
                        <div>Du kannst das Awareness-Team jederzeit unter dieser Nummer per Anruf oder Messenger erreichen:</div>
                        <div className="text-3xl">{awarenessPhoneNumber}</div>
                    </li>
                </ul>
            </div>

            <div>
                <div>Gegen Diskriminierung, Gewalt und Grenzüberschreitung</div>

                Auf dem B-Side Festival sollen sich alle Menschen sicher und wohl fühlen. Das ist leider leichter gesagt als garantiert. Was für einzelne Menschen dazu beiträgt, sich sicher oder unsicher zu fühlen, ist von Person zu Person verschieden. Auch unsere individuellen Erfahrungen mit Übergriffen und Diskriminierungen unterscheiden sich grundlegend.
            </div>

            <div>
                <div className="mb-2">
                    Deswegen bitten wir dich, an folgende Dinge zu denken:
                </div>

                <div>
                    <ol className="pl-7 space-y-2 list-decimal list-outside">
                        <li className="pl-2">Persönliche Grenzen sind individuell und subjektiv. Sie zu achten und zu respektieren sollte selbstverständlich sein! Nur ein ganz klares Ja heißt Ja. Frag lieber einmal zu viel als zu wenig nach.</li>
                        <li className="pl-2">Grenzüberschreitungen passieren alltäglich (Ja, leider auch auf alternativen Festivals in Münster) und betreffen oft Personen, die von existierenden gesellschaftlichen Machtverhältnissen bereits diskriminiert werden. Sexismus und sexualisierte Gewalt, LGBTQ*-feindlichkeit, Rassismus, Ableismus und Antisemitismus sind einige Beispiele für Diskriminierungsformen, die Menschen erleben und die wir nicht tolerieren.</li>
                        <li className="pl-2">Alle Beteiligten des Festivals (Gäste, Veranstalter*innen, Artists etc.) sind für ein diskriminierungsfreies und sicheres Miteinander verantwortlich. Jeder, der sich übergriffig oder diskriminierend verhält, muss mit Konsequenzen rechnen.</li>
                    </ol>
                </div>
            </div>

            <div>
                <div className="mb-2 font-bold underline">
                    Was du tun kannst, wenn du Grenzüberschreitung oder diskriminierendes Verhalten beobachtest oder erlebst:
                </div>

                <div>
                    <ol className="pl-7 space-y-2 list-decimal list-outside">
                        <li className="pl-2">Dich selbst und/oder den betroffenen Menschen in Sicherheit bringen. Versuche dabei zu vermeiden, fremden Menschen ungefragt zu helfen. Frage Betroffene, ob du einschreiten sollst. Im Fokus stehen immer die Bedürfnisse von Betroffenen.</li>
                        <li className="pl-2"><span className="underline">Awareness-Team</span> ansprechen. Im öffentlichen Bereich des Festivals und auf unseren Partys sind Menschen mit neon-pinken Warnwesten und mit Armbinden unterwegs. Sie helfen dir aus unangenehmen Situationen, hören dir zu, bringen dich an einen sicheren Ort und vermitteln dir weitere Unterstützung.</li>
                        <li className="pl-2"><span className="underline">Awareness-Telefon</span> anrufen. Solltest du keinen Menschen aus dem Awareness-Team sehen, kannst du jederzeit {awarenessPhoneNumber} anrufen. Menschen werden sich dann schnellstmöglich auf den Weg zu dir machen oder dir sagen, wo ihr euch in Sicherheit treffen könnt.</li>
                        <li className="pl-2"><span className="underline">Awareness-Anlaufstelle</span> aufsuchen. Vor dem B-Side Gebäude (Am Hawerkamp 29) findest du während der gesamten Festivalzeit Ansprechpersonen und einen sicheren Ort zum Reden und Ausruhen.  Während der Party am Samstagabend in der Sputnikhalle findest du immer eine Awareness-Person am Einlass, die dich auch dort an einen Rückzugsort begleiten kann.</li>
                    </ol>
                </div>
            </div>

            <div className="italic">
                Wichtig: Das Awareness-Team ersetzt nicht den Rettungsdienst. In Notfällen, die Gesundheit betreffen, bitten wir euch 112 anzurufen.
            </div>

            <AwarenessAlternativeLinks />

            <div>
                Hast du Fragen oder Anregungen bezüglich der Festival-Awareness oder möchtest im Awareness-Team mithelfen?
                Dann schreib uns eine E-Mail an <Link className="underline" href="mailto:willkommen@b-side.ms">willkommen@b-side.ms</Link>.
            </div>
        </div>
    );
};

export default AwarenessInformation;
