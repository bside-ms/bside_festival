import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { useLatestRegistrationDate, useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';
import formatDate from 'lib/common/formatDate';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';

const RegistrationFormInfo = (): ReactElement => {

    const { registration: { maxParticipants }, registrationsCount, programItem } = useRegistrationFormContext();
    const latestRegistrationDate = useLatestRegistrationDate();

    const { artistName } = getDetailsFromProgramItem(programItem);

    const participantsHint = useMemo(() => {

        if (maxParticipants === null) {
            return '';
        }

        const leftSlots = maxParticipants - registrationsCount;

        if (maxParticipants === 1) {
            return 'Aktuell ist noch 1 von 1 Platz frei.';
        }

        if (leftSlots === 1) {
            return `Aktuell ist noch 1 von ${maxParticipants} Plätzen frei.`;
        }

        return `Aktuell sind noch ${leftSlots} von ${maxParticipants} Plätzen frei.`;
    }, [maxParticipants, registrationsCount]);

    return (
        <div className="text-pink-600 mb-3 space-y-2">
            <div>
                Hiermit meldest du dich verbindlich für die Teilnahme an diesem Programmpunkt an. Nach der Anmeldung
                erhältst du eine Bestätigungsmail. Falls du unerwartet doch nicht teilnehmen kannst, gib deinen Platz
                über den Link in dieser Mail bitte wieder frei.
            </div>
            <div>
                Die Anmeldungen für {artistName} enden {formatDate(latestRegistrationDate, '\'am\' dd.MM. \'um\' HH:mm \'Uhr\'')}. {participantsHint}
            </div>
        </div>
    );
};

export default RegistrationFormInfo;
