import { faCalendarAlt, faClock, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isSameDay } from 'date-fns';
import type { ReactElement } from 'react';
import type { IconDefinition } from '@fortawesome/fontawesome-common-types';
import ApplicationType from 'lib/application-form/ApplicationType';
import formatDate from 'lib/common/formatDate';
import { usePreferredLocationName } from 'lib/context/LocationGroupsContext';
import getDetailsFromProgramItem from 'lib/strapi/getDetailsFromProgramItem';
import type FullTimeProgramItem from 'lib/strapi/typings/FullTimeProgramItem';
import type ProgramItem from 'lib/strapi/typings/ProgramItem';

interface Props {
    programItem: ProgramItem | FullTimeProgramItem;
}

const Line = ({ icon, text }: { icon: IconDefinition, text: string }): ReactElement => (
    <div className="flex gap-2">
        <div className="w-6 text-center"><FontAwesomeIcon icon={icon} /></div>
        <div>{text}</div>
    </div>
);

const LocationLine = ({ programItem }: { programItem: ProgramItem | FullTimeProgramItem }): ReactElement | null => {

    const preferredLocationName = usePreferredLocationName(programItem.attributes.location.data);

    if (preferredLocationName === null) {
        return null;
    }

    return <Line icon={faMapMarkedAlt} text={preferredLocationName} />;

};

const ArtistProgram = ({ programItem }: Props): ReactElement | null => {

    const { applicationType } = getDetailsFromProgramItem(programItem);

    const beginDate = new Date(programItem.attributes.Begin);
    const endDate = new Date(programItem.attributes.End);

    switch (applicationType) {
        case ApplicationType.konzert:
        case ApplicationType.performance:
        case ApplicationType.workshop:
        case ApplicationType.familienprogramm:
        case ApplicationType.lesung:
            return (
                <div>
                    <Line icon={faCalendarAlt} text={formatDate(beginDate, 'EEEE, dd.MM.')} />
                    <Line
                        icon={faClock}
                        text={`${formatDate(beginDate, 'HH:mm')} - ${formatDate(endDate, 'HH:mm')} Uhr`}
                    />
                    <LocationLine programItem={programItem} />
                </div>
            );

        case ApplicationType.ausstellung:
        case ApplicationType.infostand:
        case ApplicationType.essensstand: {
            if (isSameDay(beginDate, endDate)) {
                return (
                    <div>
                        <Line icon={faCalendarAlt} text={formatDate(beginDate, 'EEEE')} />
                        <LocationLine programItem={programItem} />
                    </div>
                );
            }

            return (
                <div>
                    <Line
                        icon={faCalendarAlt}
                        text={`${formatDate(beginDate, 'EEEE')} - ${formatDate(endDate, 'EEEE')}`}
                    />
                    <LocationLine programItem={programItem} />
                </div>
            );
        }

        case ApplicationType.nachbarschaft:
        case ApplicationType.anderes:
            return null;
    }
};

export default ArtistProgram;
