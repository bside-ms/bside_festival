import { addHours } from 'date-fns';
import useFormattedDate from 'lib/common/useFormattedDate';

const useApplicationCreatedDate = (createdAt: string): string => {

    /**
     * I know about time zones and stuff like that, but for some reason we have to
     * correct the creation date here. Our server's time is UTC and the creation date
     * in the database will be prefilled by MySQL with the current timestamp. But
     * somewhere between reading the database values and sending them to the client,
     * someone decides to subtract another two hours..
     */
    const correctedDate = addHours(new Date(createdAt), 2);

    return useFormattedDate(correctedDate, 'dd.MM.yyyy, HH:mm \'Uhr\'');
};

export default useApplicationCreatedDate;
