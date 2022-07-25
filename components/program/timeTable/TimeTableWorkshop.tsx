import { differenceInMinutes } from 'date-fns';
import type { ReactElement } from 'react';
import ApplicationType from 'lib/application-form/ApplicationType';
import useApplicationTypeColor from 'lib/applications/useApplicationTypeColor';
import useFormattedDate from 'lib/common/useFormattedDate';
import useScaledTimeTableMinutes from 'lib/strapi/useScaledTimeTableMinutes';
import useStrapiWorkshopUrl from 'lib/strapi/useStrapiWorkshopUrl';
import type Workshop from 'lib/strapi/Workshop';

interface Props {
    optimizedTimeTableBegin: Date;
    optimizedTimeTableEnd: Date;
    workshop: Workshop;
}

const TimeTableWorkshop = (
    { optimizedTimeTableBegin, workshop: { id, attributes: { Date: WorkshopDate, Begin, End, workshop_organizer } } }: Props
): ReactElement => {

    const formattedBegin = useFormattedDate(new Date(`${WorkshopDate} ${Begin}`), 'HH:mm');
    const formattedEnd = useFormattedDate(new Date(`${WorkshopDate} ${End}`), 'HH:mm');

    const strapiUrl = useStrapiWorkshopUrl(id);

    const diffInMinutesFromStartOfDay = useScaledTimeTableMinutes(differenceInMinutes(new Date(`${WorkshopDate} ${Begin}`), optimizedTimeTableBegin));
    // eslint-disable-next-line max-len
    const diffInMinutesFromBeginToEnd = useScaledTimeTableMinutes(differenceInMinutes(new Date(`${WorkshopDate} ${End}`), new Date(`${WorkshopDate} ${Begin}`)));

    const workshopOrganizerName = workshop_organizer.data?.attributes.Name ?? null;

    const backgroundColor = useApplicationTypeColor(ApplicationType.workshop);

    return (
        <a
            className="absolute p-1 rounded drop-shadow-md"
            style={{
                top: `${diffInMinutesFromStartOfDay}px`,
                left: '5px',
                right: '5px',
                height: `${diffInMinutesFromBeginToEnd}px`,
                backgroundColor: `${backgroundColor}CC`,
            }}
            href={strapiUrl}
            target="_blank"
        >
            {formattedBegin} - {formattedEnd} {workshopOrganizerName === null ? null : ` - ${workshopOrganizerName}`}
        </a>
    );
};

export default TimeTableWorkshop;
