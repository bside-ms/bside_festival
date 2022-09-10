import type { ReactElement } from 'react';
import { useLatestRegistrationDate } from 'components/artist/registration/RegistrationFormContext';
import formatDate from 'lib/common/formatDate';

const RegistrationClosedHint = (): ReactElement => {

    const latestRegistrationDate = useLatestRegistrationDate();

    return (
        <div className="text-pink-600">
            Die Anmeldung endete leider {formatDate(latestRegistrationDate, '\'am\' dd.MM. \'um\' HH:mm \'Uhr\'')}.
            Hoffentlich findest du noch weitere Dinge in unserem Programm, die dich interessieren!
        </div>
    );
};

export default RegistrationClosedHint;
