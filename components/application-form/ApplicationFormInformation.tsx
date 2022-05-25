
import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationType from 'lib/application-form/ApplicationType';

interface Props {
    applicationType: ApplicationType;
}

const ApplicationFormInformation = ({ applicationType }: Props): ReactElement => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
            return (
                <>
                    <div>
                        Du möchtest Deine künstlerischen Werke bei einer Ausstellung und/oder
                        einem Kunstrundgang präsentieren?
                    </div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbung, denk bitte an einen
                        Technical Rider, Referenzen, Anzahl & Formate deiner Werke.
                    </div>
                </>
            );

        case ApplicationType.performance:
            return (
                <>
                    <div>
                        Du möchtest Dich mit einer Performance, einem Theaterstück oder einem
                        kabarettistischen Beitrag bewerben?
                    </div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbung, gerne inklusive
                        Aufzeichnungen in Bild und Ton zu euren Beiträgen.
                    </div>
                </>
            );

        case ApplicationType.konzert:
            return (
                <>
                    <div>
                        Du möchtest Dich als Solokünstler:in oder mit deiner Band für ein Konzert bewerben?
                    </div>
                    <div>
                        Bitte beachte, dass wir insbesondere Künstler:innen fördern, die ihre eigenen
                        Kompositionen & Texte präsentieren. Deswegen berücksichtigen wir leider keine Coverbands.
                        Zudem bitten wir um vollständige & aussagekräftige Bewerbungen, denkt bitte an einen Technical
                        Rider und ein Demotape/Hörbeispiel.
                    </div>
                </>
            );

        case ApplicationType.workshop:
            return (
                <>
                    <div>
                        Du möchtest Dich mit einem Workshop oder einem (interaktiven) Infostand bewerben?
                    </div>
                    <div>
                        Bitte beachte, dass wir insbesondere Bewerbungen berücksichtigen, die interaktiv, kreativ &
                        niedrigschwellig sind. Zudem bitten wir um vollständige & aussagekräftige Bewerbungen.
                        Für wie viele Personen, welche Altersgruppen und welche Dauer ist Dein Vorschlag
                        geeignet? Welche technischen Voraussetzungen gibt es?
                    </div>
                    <div>
                        Du kannst gerne Bezug nehmen zu unserem diesjährigen Motto "Zurück für die Zukunft".
                        Workshops/Infostände im Bereich politischer Bildung können z.B. im Rahmen von Klimagerechtigkeit,
                        sozialökologische Transformation, Recht auf Stadt, Feminismus, Rassismuskritik, Commons,
                        soziale Gerechtigkeit, sozialer Zusammenhalt liegen. Wobei dies nur beispielhafte Themenbereiche
                        sind und deiner Kreativität keine Grenzen gesetzt sind.
                    </div>
                </>
            );

        case ApplicationType.familienprogramm:
            return (
                <>
                    <div>
                        Du hast eine Idee für das diesjährige Familienprogramm?
                    </div>
                    <div>
                        Bitte beachte, dass wir insbesondere Bewerbungen berücksichtigen, die generationsübergreifend,
                        interaktiv, kreativ & niedrigschwellig sind. Zudem bitten wir um vollständige & aussagekräftige
                        Bewerbungen. Für wie viele Personen, welche Altersgruppen und welche Dauer ist Dein Vorschlag
                        geeignet? Welche technischen Voraussetzungen gibt es?
                    </div>
                </>
            );

        case ApplicationType.lesung:
            return (
                <>
                    <div>
                        Du möchtest Dich mit einer Lesung, einem Vortrag oder einem poetischen Beitrag bewerben?
                    </div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbung, d.h. inklusive Text- & Hörproben.
                    </div>
                    <div>
                        Du kannst gerne Bezug nehmen zu unserem diesjährigen Motto "Zurück für die Zukunft".
                        Vorträge im Bereich politischer Bildung können z.B. im Rahmen von Klimagerechtigkeit,
                        sozialökologische Transformation, Recht auf Stadt, Feminismus, Rassismuskritik,
                        Commons, soziale Gerechtigkeit, sozialer Zusammenhalt liegen. Wobei dies nur beispielhafte
                        Themenbereiche sind und deiner Kreativität keine Grenzen gesetzt sind.
                    </div>
                </>
            );

        case ApplicationType.essensstand: {

            const link = 'https://www.stadt-muenster.de/gesundheit/infektionsschutz/belehrung-fuer-beschaeftigte-im-lebensmittelgewerbe';

            return (
                <>
                    <div>
                        Du möchtest dich mit einem vegetarischen/veganen Essensstand (zero waste) bewerben?
                    </div>
                    <div>
                        Wir bitten um vollständige & aussagekräftige Bewerbungen.
                    </div>
                    <div>
                        Wichtig: Für Essensstände ist für alle Mitarbeitenden ein Gesundheitszeugnis notwendig
                        (für 25 € bei der Stadt Münster <Link href={link}><a className="underline">hier</a></Link> zu erhalten).
                    </div>
                    {/* TODO: Hinweis auf Standgebühr */}
                </>
            );
        }

        case ApplicationType.nachbarschaft:
            return (
                <>
                    <div>
                        Du hast einen Zugang zu einem Hinterhof im Hansaviertel? Du möchtest deinen Hinterhof
                        für Ausstellungen, Konzerte, Lesungen, Stände uvm. zur Verfügung stellen?
                    </div>
                    <div>
                        Wir bitten um vollständige und aussagekräftige Bewerbungen. Wo liegt der Hinterhof?
                        Wie viele Personen finden Platz? Welcher Programmpunkt ist geeignet? An welchen Tagen
                        können wir den Platz nutzen? Wer ist unser:e Ansprechperson?
                    </div>
                </>
            );
    }
};

export default ApplicationFormInformation;
