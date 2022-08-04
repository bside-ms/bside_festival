import formatDate from 'lib/common/formatDate';

const useApplicationCreatedDate = (createdAt: string): string => (
    formatDate(new Date(createdAt), 'dd.MM.yyyy, HH:mm \'Uhr\'')
);

export default useApplicationCreatedDate;
