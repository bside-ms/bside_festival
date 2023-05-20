import { faEnvelope, faHouse, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Participant } from '@prisma/client';
import type { ReactElement } from 'react';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import typeLabels from 'lib/participants/typeLabels';

interface Props {
  application: Participant;
}

const ApplicationDetails = ({
    application: {
        id, name, type, description, contactName, contactMail, contactPhone, motivation, address, residence,
    },
}: Props): ReactElement => {
    const imageUrl = `https://picsum.photos/seed/${id}/400/200`;

    return (
        <div className="relative rounded-md p-3 text-gray-800 shadow-lg">
            <div className="relative mb-2 h-32 w-full overflow-hidden rounded-md md:h-52">
                <div
                    className="absolute top-0 right-0 bottom-0 left-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div
                    className="absolute top-0 right-0 bottom-0 left-0 bg-contain bg-center bg-no-repeat backdrop-blur-2xl"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            </div>

            <div className="text-sm uppercase text-gray-600">{typeLabels[type]}</div>

            <div className="text-xl">{name}</div>

            {isNotEmptyString(description) && (
                <div>
                    <div>{description}</div>
                    <FontAwesomeIcon icon={faUser} />
                    <div>{contactName}</div>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <div>{contactMail}</div>
                    <FontAwesomeIcon icon={faPhone} />
                    <div>{contactPhone}</div>
                    <FontAwesomeIcon icon={faLocationDot} />
                    <div>{address}</div>
                    <FontAwesomeIcon icon={faHouse} />
                    <div>{residence}</div>
                    <div>{motivation}</div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetails;
