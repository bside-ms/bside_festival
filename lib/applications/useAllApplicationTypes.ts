import ApplicationType from 'lib/application-form/ApplicationType';

const useAllApplicationTypes = (): Array<ApplicationType> => Object.values(ApplicationType);

export default useAllApplicationTypes;
