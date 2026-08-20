import AwarenessSectionHeading from '@/components/awareness/AwarenessSectionHeading';
import { awarenessPhone } from '@/lib/public/awareness';
import type { ReactElement } from 'react';

const AwarenessEasyGerman = (): ReactElement => {
    return (
        <>
            <section>
                <AwarenessSectionHeading>Menschen, die dir helfen können:</AwarenessSectionHeading>
                <p>
                    Wenn du Hilfe brauchst oder Unterstützung bei einem Problem / einer Situation auf dem Festival suchst, kannst du dich
                    jederzeit wenden an:
                </p>
                <ul className="mt-3 list-outside list-disc space-y-2 pl-7">
                    <li>Du erkennst uns Helfer*innen an den pinken Westen.</li>
                    <li>Das Awareness-Team ist am Infowagen/Eingang und läuft auf dem Gelände umher.</li>
                    <li>Du findest das Team im B-Side-Wohnzimmer an einem Stand, wo du dich auch mal ausruhen kannst.</li>
                    <li>Wenn du einfach mal eine Pause brauchst, bringen wir dich dorthin.</li>
                    <li>Awareness-Nummer: {awarenessPhone}</li>
                </ul>
            </section>

            <section>
                <p>
                    Unser Ziel ist, dass sich alle Menschen bei uns wohlfühlen und einen respektvollen Umgang miteinander haben. Wir wollen,
                    dass niemand verletzt oder schlecht behandelt wird. Deshalb haben wir Verhaltensregeln, die für alle gelten. Wir bitten
                    dich, während dem Festival auch eine Verantwortung für dich selbst und für alle anderen zu übernehmen. Hier sind unsere
                    wichtigsten Regeln:
                </p>
                <ol className="mt-4 list-outside list-decimal space-y-4 pl-7">
                    <li>
                        <span className="font-bold">Persönliche Grenzen:</span> Jeder Mensch hat eigene Grenzen. Das bedeutet: was für einen
                        Mensch okay ist, ist für einen anderen Menschen zu viel. Wir akzeptieren die Grenzen von anderen ungefragt.{' '}
                        <strong>Nur ein Ja ist ein Ja.</strong> Frag lieber nach, wenn du nicht sicher bist. Ohne deine eigene Einladung
                        darfst du niemanden berühren.
                    </li>
                    <li>
                        <span className="font-bold">Diskriminierung und Grenzen:</span> Diskriminierung bedeutet, Menschen schlecht zu
                        behandeln, weil sie anders sind als man selbst oder nicht so ist, wie die Gesellschaft es verlangt (wegen ihrer
                        Herkunft, ihres Geschlechts, ihres Alters, ihrer Behinderung, ihrer Sexualität, ihrer Weltanschauung, ihres
                        Körpers). Grenzüberschreitungen sind zum Beispiel: Unangenehme Sprüche, Ungewollte Berührungen, Provokante
                        Fragestellungen, Beleidigungen. Wir wollen mit einem aufmerksamen und respektvollen Miteinander dagegen vorgehen.
                    </li>
                    <li>
                        <span className="font-bold">Respekt für Kulturen:</span> Zeige Wertschätzung und Respekt für die Rituale und
                        Traditionen anderer Kulturen. Nimm keine Symbole oder Gegenstände aus anderen Kulturen, um sie zu benutzen oder zu
                        zeigen, ohne ihre Geschichte zu kennen. Respektiere Bräuche, auch wenn sie dir fremd sind.
                    </li>
                    <li>
                        <span className="font-bold">Geschlechter und Pronomen:</span> Stecke keine Menschen aufgrund ihres Aussehens in
                        Schubladen wie Mann oder Frau. Frag lieber nach ihrem gewünschten Pronomen (wie zum Beispiel „sie“, „er“ oder
                        „dey“). Respektiere den Wunsch der Person.
                    </li>
                    <li>
                        <span className="font-bold">Selbstfürsorge/Selfcare:</span> Sei gut zu dir selbst. Wenn du dich unsicher fühlst,
                        sprich mit Freunden darüber. Nutze das B-Side-Wohnzimmer als Rückzugsort, nimm dir eine Auszeit und trinke Wasser.
                        Lass dein Getränk nicht aus den Augen. Prost.
                    </li>
                </ol>
            </section>

            <section>
                <AwarenessSectionHeading>Was tun, wenn du etwas Unangenehmes siehst oder erlebst?</AwarenessSectionHeading>
                <ol className="list-outside list-decimal space-y-3 pl-7">
                    <li>
                        <span className="font-bold">Hilf der betroffenen Person:</span> Frage diese Person, ob sie Hilfe braucht oder
                        möchte. Hör zu, und glaube ihr. Akzeptiere die Wünsche der betroffenen Person!
                    </li>
                    <li>
                        <span className="font-bold">Wende dich an das Awareness-Team, die Theke oder Ordner*innen:</span> Das Team fragt
                        dich: Was kann ich tun, damit du dich wieder sicher fühlst? Du kannst uns erreichen unter: {awarenessPhone}
                    </li>
                </ol>
                <p className="mt-4 font-bold text-[#e23b3b]">Im Notfall bitte den Notruf 112 rufen!</p>
            </section>
        </>
    );
};

export default AwarenessEasyGerman;
