import ApplicationType from 'lib/application-form/ApplicationType';

const useIsValidApplicationType = (applicationType: string): applicationType is ApplicationType => (
    Object.values<string>(ApplicationType).includes(applicationType)
);

export default useIsValidApplicationType;
