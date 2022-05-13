import ApplicationType from 'lib/application-form/ApplicationType';

const useApplicationTitle = (applicationType: ApplicationType): string => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
            return '/assets/images/festival/19-105-min.jpg';
        case ApplicationType.performance:
            return '/assets/images/festival/19-119-min.jpg';
        case ApplicationType.konzert:
            return '/assets/images/festival/19-572-min.jpg';
        case ApplicationType.workshop:
            return '/assets/images/festival/19-30-min.jpg';
        case ApplicationType.familienprogramm:
            return '/assets/images/festival/19-105-min.jpg';
        case ApplicationType.lesung:
            return '/assets/images/festival/19-475-min.jpg';
        case ApplicationType.essensstand:
            return '/assets/images/festival/19-479-min.jpg';
        case ApplicationType.nachbarschaft:
            return '/assets/images/festival/19-537-min.jpg';
    }
};

export default useApplicationTitle;
