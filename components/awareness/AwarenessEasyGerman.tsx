import type { ReactElement } from 'react';

const AwarenessEasyGerman = (): ReactElement => {
    return (
        <div className="flex flex-col gap-5 bg-white p-4 font-sans drop-shadow-2xl">
            <div>
                <div className="mb-1 text-lg font-bold">Menschen, die dir helfen können</div>
                <div>
                    Beim B-Side Festival gibt es ein Team, das auf dich aufpasst. Dieses Team hilft dir, wenn jemand gemein zu dir ist
                    oder du dich nicht wohlfühlst.
                </div>
                <ul className="list-outside list-disc space-y-2 pl-7">
                    <li className="pl-2">Du erkennst das Team an den leuchtend pinken Westen.</li>
                    <li className="pl-2">Du kannst jederzeit mit ihnen sprechen, wenn du dich nicht gut fühlst oder Fragen hast.</li>
                    <li className="pl-2">Du findest das Team im B-Side Wohnzimmer. Dort kannst du mit ihnen reden.</li>
                    <li className="pl-2">Wenn du einen ruhigen Ort brauchst, bringen sie dich dorthin.</li>
                    <li className="pl-2">Awareness-Telefon: 01788887435</li>
                </ul>
            </div>

            <div>
                <div>
                    Wir möchten, dass alle Menschen freundlich, respektvoll und hilfsbereit sind. Alle sollen sich wohl fühlen. Niemand soll
                    verletzt oder schlecht behandelt werden. Deshalb gibt es Regeln für alle. Alle sollen auf sich und auf andere achten.
                </div>
            </div>

            <div>
                <div className="mb-1 font-bold">Hier sind die wichtigsten Regeln</div>

                <div className="space-y-3">
                    <div>
                        <div className="underline">Persönliche Grenzen</div>
                        <div>
                            Jeder Mensch hat eigene Grenzen. Was für eine Person okay ist, ist für eine andere Person vielleicht nicht okay.
                            Respektiere die Grenzen von anderen.
                        </div>
                        <ul className="list-outside list-disc space-y-1 pl-7">
                            <li className="pl-2">Nur ein „Ja“ ist ein Ja.</li>
                            <li className="pl-2">Frag lieber noch einmal nach, bevor du etwas machst.</li>
                            <li className="pl-2">Bitte behalte deine Kleidung an, damit sich niemand unwohl fühlt.</li>
                        </ul>
                    </div>

                    <div>
                        <div className="underline">Diskriminierung und Grenzen überschreiten</div>
                        <div>
                            Diskriminierung bedeutet: Menschen werden schlecht behandelt, weil sie anders sind. Das ist nicht erlaubt. Gründe
                            können sein: Herkunft, Geschlecht, Alter, Hautfarbe, Sexualität, Gesundheit oder Besitz.
                        </div>
                        <div>Grenzüberschreitungen sind zum Beispiel:</div>
                        <ul className="list-outside list-disc space-y-1 pl-7">
                            <li className="pl-2">Unangenehme Sprüche</li>
                            <li className="pl-2">Ungewolltes Anfassen</li>
                            <li className="pl-2">Zu persönliche Fragen</li>
                            <li className="pl-2">Andere ausschließen</li>
                        </ul>
                        <div>So etwas tolerieren wir nicht und werden, wenn möglich, dagegen vorgehen.</div>
                    </div>

                    <div>
                        <div className="underline">Respekt für Kulturen</div>
                        <div>
                            Zeige Verständnis und Respekt für die Bräuche und Traditionen anderer Kulturen. Nimm keine Symbole oder
                            Gegenstände aus anderen Kulturen, um sie zu benutzen oder zu zeigen. Tu das nicht, wenn du die Bedeutung nicht
                            kennst. Das nennt man „Aneignung“. Das ist nicht erlaubt.
                        </div>
                    </div>

                    <div>
                        <div className="underline">Geschlechter und Pronomen</div>
                        <ul className="list-outside list-disc space-y-1 pl-7">
                            <li className="pl-2">Stecke Menschen nicht wegen ihres Aussehens in Schubladen.</li>
                            <li className="pl-2">Frage, wie die Person genannt werden möchte (z. B. „sie“, „er“, „they“, „Name“).</li>
                            <li className="pl-2">Respektiere die Wünsche der Person.</li>
                        </ul>
                    </div>

                    <div>
                        <div className="underline">Selbst-Fürsorge</div>
                        <ul className="list-outside list-disc space-y-1 pl-7">
                            <li className="pl-2">Pass auf dich auf.</li>
                            <li className="pl-2">Wenn du dich unsicher fühlst, sprich mit Freund*innen darüber.</li>
                            <li className="pl-2">Schütze dein Getränk vor K.-o.-Tropfen. Nutze einen Deckel und lass dein Getränk nicht aus den Augen.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div>
                <div className="mb-1 font-bold">Was tun, wenn du etwas Unangenehmes siehst oder erlebst?</div>
                <ol className="list-outside list-decimal space-y-2 pl-7">
                    <li className="pl-2">
                        <span className="font-semibold">Hilf den Betroffenen.</span> Zeige, dass du da bist, und biete Hilfe an. Höre zu und
                        glaube der Person. Frage, was die Person braucht.
                    </li>
                    <li className="pl-2">
                        <span className="font-semibold">Wende dich an das Awareness-Team, die Theke oder das Sicherheitspersonal.</span> Das Team
                        trägt pinke Westen. Du kannst sie ansprechen, wenn du Hilfe brauchst. Du kannst auch anrufen: 01788887435.
                    </li>
                </ol>
            </div>

            <div className="italic">
                Wichtig: Das Awareness-Team ersetzt nicht den Rettungsdienst. In Notfällen rufe bitte den Notruf 112 an.
            </div>
        </div>
    );
};

export default AwarenessEasyGerman;
