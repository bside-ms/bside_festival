import ApplicationType from 'lib/application-form/ApplicationType';

const useApplicationEndDate = (applicationType: ApplicationType): Date => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
        case ApplicationType.konzert:
            return new Date(Date.UTC(2022, 5, 27, 21, 59, 59));

        case ApplicationType.performance:
        case ApplicationType.workshop:
        case ApplicationType.familienprogramm:
        case ApplicationType.lesung:
        case ApplicationType.essensstand:
        case ApplicationType.nachbarschaft:
        case ApplicationType.anderes:
            return new Date(Date.UTC(2022, 6, 4, 21, 59, 59));
    }
};

export default useApplicationEndDate;
