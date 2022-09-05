import formatDate from 'lib/common/formatDate';

const useApplicationCreatedDate = (createdAt: string): string => (
    formatDate(createdAt, 'dd.MM.yyyy, HH:mm \'Uhr\'')
);

export default useApplicationCreatedDate;
