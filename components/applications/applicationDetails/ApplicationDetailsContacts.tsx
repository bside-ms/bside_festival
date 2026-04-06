import isEmptyString from '@/lib/common/helper/isEmptyString';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import { faEnvelope, faLocationDot, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';

interface Props {
    application: SerializableParticipant;
}

const ApplicationDetailsContacts = ({ application: { contactName, contactPhone, contactMail } }: Props): ReactElement | null => {
    return (
        <div>
            {isNotEmptyString(contactName) && (
                <div className="flex items-center">
                    <div className="mr-2 w-4 shrink-0 text-center text-sm">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div>{contactName}</div>
                </div>
            )}
            {isNotEmptyString(contactMail) && (
                <div className="flex items-center">
                    <div className="mr-2 w-4 shrink-0 text-center text-sm">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div>{contactMail}</div>
                </div>
            )}
            {isNotEmptyString(contactPhone) && (
                <div className="flex items-center">
                    <div className="mr-2 w-4 shrink-0 text-center text-sm">
                        <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div>{contactPhone}</div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetailsContacts;
