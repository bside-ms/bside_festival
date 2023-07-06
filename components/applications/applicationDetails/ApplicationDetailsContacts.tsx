import { faEnvelope, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import isEmptyString from 'lib/common/helper/isEmptyString';
import isNotEmptyString from 'lib/common/helper/isNotEmptyString';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsContacts = ({ application: {
    contactName,
    contactPhone,
    contactMail,
    residence,
} }: Props): ReactElement | null => {

    if (isEmptyString(residence) && isEmptyString(contactName) && isEmptyString(contactMail) && isEmptyString(contactPhone)) {
        return null;
    }

    return (
        <div className="mt-4">
            {isNotEmptyString(residence) && (
                <div className="flex items-center">
                    <div className="shrink-0 text-center w-4 mr-2 text-sm"><FontAwesomeIcon icon={faLocationDot} /></div>
                    <div>{residence}</div>
                </div>
            )}
            {isNotEmptyString(contactName) && (
                <div className="flex items-center">
                    <div className="shrink-0 text-center w-4 mr-2 text-sm"><FontAwesomeIcon icon={faUser} /></div>
                    <div>{contactName}</div>
                </div>
            )}
            {isNotEmptyString(contactMail) && (
                <div className="flex items-center">
                    <div className="shrink-0 text-center w-4 mr-2 text-sm"><FontAwesomeIcon icon={faEnvelope} /></div>
                    <div>{contactMail}</div>
                </div>
            )}
            {isNotEmptyString(contactPhone) && (
                <div className="flex items-center">
                    <div className="shrink-0 text-center w-4 mr-2 text-sm"><FontAwesomeIcon icon={faPhone} /></div>
                    <div>{contactPhone}</div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetailsContacts;
