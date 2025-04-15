import { Type } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    type: Type;
}

const ApplicationTypeIntro = ({ type }: Props): ReactElement => {
    switch (type) {
        case Type.Concert:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>Du möchtest Dich als Solokünstler:in oder mit deiner Band für ein Konzert bewerben?</div>
                    <div>
                        Bitte beachte, dass wir insbesondere Künstler:innen fördern, die ihre eigenen Kompositionen & Texte präsentieren.
                        Deswegen berücksichtigen wir leider keine Coverbands. Zudem bitten wir um vollständige & aussagekräftige
                        Bewerbungen, denkt bitte an einen Technical Rider und schickt 1-2 eurer besten Songs (Demotape/Hörbeispiel).
                    </div>
                </div>
            );

        case Type.DiskJockey:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>Du möchtest Dich als DJ oder DJ-Duo für die musikalische B-gleitung des Festivals bewerben?</div>
                    <div>
                        Bitte beachte, dass wir insbesondere Künstler:innen fördern, die ihre eigenen Kompositionen & diverse Sounds
                        präsentieren. Zudem bitten wir um vollständige & aussagekräftige Bewerbungen, denkt bitte an einen Technical Rider
                        und schickt 1-2 eurer besten Songs oder Setausschnitte (Demotape/Hörbeispiel).
                    </div>
                </div>
            );

        case Type.FamilyProgram:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>Du hast eine Idee für das diesjährige Familienprogramm?</div>
                    <div>
                        Bitte beachte, dass wir insbesondere Bewerbungen berücksichtigen, die generationsübergreifend, interaktiv, kreativ &
                        niedrigschwellig sind. Zudem bitten wir um vollständige & aussagekräftige Bewerbungen. Für wie viele Personen,
                        welche Altersgruppen und welche Dauer ist Dein Vorschlag geeignet? Welche technischen Voraussetzungen gibt es?
                    </div>
                </div>
            );

        case Type.Exhibition:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>
                        Im Sinne unseres Mottos: B-together, B-loved – B-Side! soll in den Räumen der neuen B-Side eine Ausstellung rund um
                        die Themen Gemeinschaft, Liebe und Empathie aus privater und/oder politischer Perspektive entstehen. Du hast bereits
                        ein Kunstwerk, das zum Thema passt oder möchtest ein neues entwickeln?
                    </div>
                    <div>
                        Losgelöst von dieser Gruppenausstellung kannst du dich auch mit einer Ausstellungsidee für das Viertel bewerben.
                    </div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbung inklusive der von dir verwendeten Materialien, die Anzahl
                        deiner Werke und der Formate sowie der benötigten Technik (siehe Technical Rider).
                    </div>
                </div>
            );

        case Type.Reading:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>Du möchtest Dich mit einer Lesung, einem Vortrag oder einem poetischen Beitrag bewerben?</div>
                    <div>Wir bitten um vollständige & aussagekräftige Bewerbung, das heißt inklusive Text- & Hörproben.</div>
                </div>
            );

        case Type.Performance:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>Du möchtest Dich mit einer Performance, einem Theaterstück oder einem kabarettistischen Beitrag bewerben?</div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbung, das heißt inklusive Aufzeichnungen in Bild und Ton zu euren
                        Beiträgen sowie dem Technical Rider mit allen technischen Infos.
                    </div>
                </div>
            );

        case Type.Workshop:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>Ihr möchtet euch mit einem Workshop bewerben?</div>
                    <div>
                        Bitte beachte, dass wir insbesondere Bewerbungen berücksichtigen, die generationsübergreifend, interaktiv, kreativ &
                        niedrigschwellig sind. Zudem bitten wir um vollständige & aussagekräftige Bewerbungen. Für wie viele Personen,
                        welche Altersgruppen und welche Dauer ist Dein Vorschlag geeignet? Welche technischen Voraussetzungen gibt es?
                    </div>
                </div>
            );

        case Type.InfoBooth:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>Ihr möchtet euch mit einem (interaktiven) Infostand bewerben?</div>
                    <div>
                        Bitte beachtet, dass wir insbesondere Bewerbungen berücksichtigen, die generationsübergreifend, interaktiv, kreativ
                        & niedrigschwellig sind. Zudem bitten wir um vollständige & aussagekräftige Bewerbungen. Für wie viele Personen,
                        welche Altersgruppen und welche Dauer ist euer Vorschlag geeignet? Welche technischen Voraussetzungen gibt es?
                    </div>
                </div>
            );

        case Type.Misc:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                    <div>
                        Du möchtest Dich mit einem Format oder einer Idee bewerben, die nicht in unseren Kategorien zu finden ist? Dann hast
                        du hier die Möglichkeit dich zu bewerben.
                    </div>
                    <div>
                        Bitte beachte, dass wir insbesondere Bewerbungen berücksichtigen, die generationsübergreifend, interaktiv, kreativ &
                        niedrigschwellig sind. Zudem bitten wir um vollständige & aussagekräftige Bewerbungen. Für wie viele Personen,
                        welche Altersgruppen und welche Dauer ist Dein Vorschlag geeignet? Welche technischen Voraussetzungen gibt es?
                    </div>
                </div>
            );

        case Type.Food:
        case Type.Neighbor:
        case Type.Catering:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong>
                        <br />
                    </div>
                    <div>Die Bewerbungsphase für das B-Side Festival 2025 ist eröffnet.</div>
                </div>
            );
    }
};

export default ApplicationTypeIntro;
