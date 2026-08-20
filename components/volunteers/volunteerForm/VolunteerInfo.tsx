import type { ReactElement } from 'react';

const VolunteerInfo = (): ReactElement => {
    return (
        <div className="flex flex-col gap-4 text-sm leading-relaxed md:text-base">
            <p>
                Am 18. und 19. September brauchen wir euch als Helfer*innen am Hafen und im Hansaviertel. Nur mit euch wird das Festival
                wieder so schön wie in den letzten Jahren.
            </p>
            <p>
                Helfen kann jede*r. Es geht um ganz normale Schichten: Auf- und Abbau, Bühnen, Essen, Awareness, Spenden. Vorerfahrung
                braucht ihr nicht.
            </p>
            <p>
                Nach der Anmeldung bestätigt ihr einmalig eure E-Mail. Sobald die Schichtpläne stehen, könnt ihr euch eintragen. Ungefähr
                zwei Wochen vor dem Festival gibt es ein Treffen, während des Festivals eine Telegram-Gruppe.
            </p>
        </div>
    );
};

export default VolunteerInfo;
