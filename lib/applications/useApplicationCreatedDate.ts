import useFormattedDate from 'lib/common/useFormattedDate';

const useApplicationCreatedDate = (createdAt: string): string => (
    useFormattedDate(new Date(createdAt), 'dd.MM.yyyy, HH:mm \'Uhr\'')
);

export default useApplicationCreatedDate;
