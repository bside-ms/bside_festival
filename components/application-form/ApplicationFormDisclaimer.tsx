import type { ReactElement } from 'react';
import ApplicationType from 'lib/application-form/ApplicationType';

interface Props {
    applicationType: ApplicationType;
}

const ApplicationFormDisclaimer = ({ applicationType }: Props): ReactElement | null => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
        case ApplicationType.performance:
        case ApplicationType.konzert:
        case ApplicationType.lesung:
            return (
                <div className=" text-[#3a1a85] text-sm space-y-3 mt-4">
                    <div>
                        Das B-Side Festival ist auch 2022 ein Festival für alle mit vielfältigem und
                        buntem Programm. Dabei wollen wir insbesondere Räume und Bühnen für FLINTA*
                        und andere marginalisierte Gesellschaftsgruppen schaffen.
                    </div>

                    <div>
                        Das B-Side Festival wird nicht kommerziell, ohne Eintrittsgelder und im Sinne
                        der Gemeinnützigkeit für die Allgemeinheit frei zugänglich veranstaltet. Das
                        Festival wird auch dieses Jahr wieder durch öffentliche Fördermittel, Spenden
                        und den Eigenanteil des B-Side Kultur e.V. als Veranstalter finanziert. Im
                        Rahmen unserer finanziellen Möglichkeiten erhalten alle künstlerischen
                        und kulturellen Programmpunkte je eine Gage i.H.v. 100 Euro (Materialkosten
                        und Fahrtkosten können nach vorheriger Absprache erstattet werden).
                    </div>
                </div>
            );

        case ApplicationType.workshop:
            return (
                <div className=" text-[#3a1a85] text-sm space-y-3 mt-4">
                    <div>
                        Das B-Side Festival ist auch 2022 ein Festival für alle mit vielfältigem und
                        buntem Programm. Dabei wollen wir insbesondere Räume und Bühnen für FLINTA*
                        und andere marginalisierte Gesellschaftsgruppen schaffen.
                    </div>

                    <div>
                        Das B-Side Festival wird nicht kommerziell, ohne Eintrittsgelder und im Sinne
                        der Gemeinnützigkeit für die Allgemeinheit frei zugänglich veranstaltet. Das
                        Festival wird auch dieses Jahr wieder durch öffentliche Fördermittel, Spenden
                        und den Eigenanteil des B-Side Kultur e.V. als Veranstalter finanziert. Im
                        Rahmen unserer finanziellen Möglichkeiten erhalten alle Angebote des
                        Bildungsprogramms (Workshops und Vorträge) je ein Honorar i.H.v. 100 Euro
                        (Materialkosten und Fahrtkosten können nach vorheriger Absprache erstattet
                        werden).
                    </div>
                </div>
            );

        case ApplicationType.familienprogramm:
        case ApplicationType.anderes:
            return (
                <div className=" text-[#3a1a85] text-sm space-y-3 mt-4">
                    <div>
                        Das B-Side Festival ist auch 2022 ein Festival für alle mit vielfältigem und
                        buntem Programm. Dabei wollen wir insbesondere Räume und Bühnen für FLINTA*
                        und andere marginalisierte Gesellschaftsgruppen schaffen.
                    </div>

                    <div>
                        Das B-Side Festival wird nicht kommerziell, ohne Eintrittsgelder und im Sinne
                        der Gemeinnützigkeit für die Allgemeinheit frei zugänglich veranstaltet. Das
                        Festival wird auch dieses Jahr wieder durch öffentliche Fördermittel, Spenden
                        und den Eigenanteil des B-Side Kultur e.V. als Veranstalter finanziert. Im
                        Rahmen unserer finanziellen Möglichkeiten erhalten Kunst- und Kulturveranstaltungen
                        und Angebote des Bildungsprogramms eine finanzielle Förderung. (Materialkosten
                        und Fahrtkosten können nach vorheriger Absprache erstattet werden).
                    </div>
                </div>
            );

        case ApplicationType.essensstand:
        case ApplicationType.nachbarschaft:
            return null;
    }

};

export default ApplicationFormDisclaimer;
