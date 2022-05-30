import type ApplicationData from 'lib/application-form/ApplicationData';
import ApplicationType from 'lib/application-form/ApplicationType';

const useApplicationTypesWithCounts = (allApplication: Array<ApplicationData>): Record<ApplicationType, number> => {

    const applicationTypesWithCounts: Record<ApplicationType, number> = {
        [ApplicationType.ausstellung]: 0,
        [ApplicationType.performance]: 0,
        [ApplicationType.konzert]: 0,
        [ApplicationType.workshop]: 0,
        [ApplicationType.familienprogramm]: 0,
        [ApplicationType.lesung]: 0,
        [ApplicationType.essensstand]: 0,
        [ApplicationType.nachbarschaft]: 0,
        [ApplicationType.anderes]: 0,
    };

    allApplication.forEach(application => applicationTypesWithCounts[application.type]++);

    return applicationTypesWithCounts;
};

export default useApplicationTypesWithCounts;
