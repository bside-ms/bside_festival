import { isAfter } from 'date-fns';
import useApplicationEndDate from 'lib/application-form/useApplicationEndDate';
import useAllApplicationTypes from 'lib/applications/useAllApplicationTypes';

const useLatestApplicationEndDate = (): Date => {

    const allApplicationTypes = useAllApplicationTypes();

    const latestEndDate = allApplicationTypes.reduce<Date | null>(
        (currentLatestEndDate, currentApplicationType) => {

            // It's safe because we don't actually use any React hooks in there
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const endDate = useApplicationEndDate(currentApplicationType);

            if (currentLatestEndDate === null || isAfter(endDate, currentLatestEndDate)) {
                return endDate;
            }

            return currentLatestEndDate;
        },
        null
    );

    return latestEndDate ?? new Date();
};

export default useLatestApplicationEndDate;
