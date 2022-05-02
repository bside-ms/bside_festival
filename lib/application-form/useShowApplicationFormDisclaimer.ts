import ApplicationType from 'lib/application-form/ApplicationType';

const useShowApplicationFormDisclaimer = (applicationType: ApplicationType): boolean => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
        case ApplicationType.performance:
        case ApplicationType.konzert:
        case ApplicationType.workshop:
        case ApplicationType.familienprogramm:
        case ApplicationType.lesung:
            return true;

        case ApplicationType.essensstand:
        case ApplicationType.nachbarschaf:
            return false;
    }
};

export default useShowApplicationFormDisclaimer;
