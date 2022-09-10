import type { ReactElement } from 'react';
import { useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';

const RegistrationBookedOutHint = (): ReactElement => {

    const { registration } = useRegistrationFormContext();

    return (
        <div className="text-pink-600">
            Aktuell sind leider alle {registration.maxParticipants!} Plätze für diesen Programmpunkt belegt.
            Schau später nochmal nach, ob sich ein:e Teilnehmer:in abgemeldet hat.
        </div>
    );
};

export default RegistrationBookedOutHint;
