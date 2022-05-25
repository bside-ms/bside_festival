import format from 'date-fns/format';

const useApplicationCreatedDate = (createdAt: Date): string => {

    return format(new Date(createdAt), 'dd.MM.yyyy, HH:mm \'Uhr\'');
};

export default useApplicationCreatedDate;
