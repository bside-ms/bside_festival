import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import { useRegistrationFormContext } from 'components/artist/registration/RegistrationFormContext';

const RegistrationSuccessfullySubmittedHint = (): ReactElement => {

    const { formValues: { mailAddress }, handleCloseRegistration } = useRegistrationFormContext();

    return (
        <div className="max-w-xl border-pink-300 border rounded p-5 pr-8 text-pink-600 flex gap-3 items-center relative">
            <div
                className="absolute top-0 right-0 p-3 text-lg leading-4 cursor-pointer hover:text-pink-400"
                onClick={handleCloseRegistration}
            >
                <FontAwesomeIcon icon={faTimes} />
            </div>
            <div className="text-5xl">
                <FontAwesomeIcon icon={faThumbsUp} />
            </div>
            <div>
                Die Anmeldung war erfolgreich. Wir senden dir eine Bestätigung an {mailAddress} (dies
                kann unter Umständen einen Moment dauern). In der Mail findest du einen Link, den du
                zur Abmeldung nutzen kannst, wenn du unerwartet doch nicht teilnehmen kannst.
            </div>
        </div>
    );
};

export default RegistrationSuccessfullySubmittedHint;
