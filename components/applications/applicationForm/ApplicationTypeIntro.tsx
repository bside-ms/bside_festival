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
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong><br />
                    </div>
                    <div>
                        Die Bewerbungsphase für das B-Side Festival 2023 ist eröffnet.
                    </div>
                    <div>
                        Du möchtest Dich als Solokünstler:in oder mit deiner Band für ein Konzert bewerben?
                    </div>
                    <div>
                        Bitte beachtet, dass wir insbesondere Künstler:innen fördern, die ihre
                        eigenen Kompositionen & Texte präsentieren. Deswegen berücksichtigen wir leider
                        keine Coverbands. Zudem bitten wir um vollständige & aussagekräftige Bewerbungen.
                        Und schickt bitte 1-2 eurer besten Songs (Demotape/Hörbeispiel).
                    </div>
                </div>
            );

        case Type.Reading:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong><br />
                    </div>
                    <div>
                        Die Bewerbungsphase für das B-Side Festival 2023 ist eröffnet.
                    </div>
                    <div>
                        Ihr möchtet euch mit einer Lesung, einem Vortrag oder einem poetischen Beitrag bewerben?
                    </div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbung, d.h. inklusive Text- & Hörproben.
                    </div>
                </div>
            );

        case Type.FamilyProgram:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong><br />
                    </div>
                    <div>
                        Die Bewerbungsphase für das B-Side Festival 2023 ist eröffnet.
                    </div>
                    <div>
                        Ihr habt eine Idee für das diesjährige Familienprogramm?
                    </div>
                </div>
            );

        case Type.Workshop:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong><br />
                    </div>
                    <div>
                        Die Bewerbungsphase für das B-Side Festival 2023 ist eröffnet.
                    </div>
                    <div>
                        Ihr möchtet euch mit einem Workshop oder einem (interaktiven) Infostand bewerben?
                    </div>
                    <div>
                        Bitte beachtet, dass wir insbesondere Bewerbungen berücksichtigen, die
                        generationsübergreifend, interaktiv, kreativ & niedrigschwellig sind. Zudem
                        bitten wir um vollständige & aussagekräftige Bewerbungen. Für wie viele Personen,
                        welche Altersgruppen und welche Dauer ist euer Vorschlag geeignet? Welche
                        technischen Voraussetzungen gibt es?
                    </div>
                </div>
            );

        case Type.Performance:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong><br />
                    </div>
                    <div>
                        Die Bewerbungsphase für das B-Side Festival 2023 ist eröffnet.
                    </div>
                    <div>
                        Ihr möchtet euch mit einer Performance, einem Theaterstück oder
                        einem kabarettistischen Beitrag bewerben?
                    </div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbung, d.h. inklusive
                        Aufzeichnungen in Bild und Ton zu euren Beiträgen.
                    </div>
                </div>
            );

        case Type.Exhibition:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong><br />
                    </div>
                    <div>
                        Die Bewerbungsphase für das B-Side Festival 2023 ist eröffnet.
                    </div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbung.
                    </div>
                </div>
            );

        case Type.Misc:
        default:
            return (
                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Schön, dass Du Dich für das diesjährige Festival bewerben möchtest!</strong><br />
                    </div>
                    <div>
                        Die Bewerbungsphase für das B-Side Festival 2023 ist eröffnet.
                    </div>
                </div>
            );
    }
};

export default ApplicationTypeIntro;
