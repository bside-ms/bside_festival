import ApplicationType from 'lib/application-form/ApplicationType';

const useApplicationTitle = (applicationType: ApplicationType): string => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
            return '/assets/images/festival/20-384-min.jpg';
        case ApplicationType.performance:
            return '/assets/images/festival/19-295-min.jpg';
        case ApplicationType.konzert:
            return '/assets/images/festival/19-105-min.jpg';
        case ApplicationType.workshop:
            return '/assets/images/festival/20-119-min.jpg';
        case ApplicationType.familienprogramm:
            return 'https://place-puppy.com/550x401';
        case ApplicationType.lesung:
            return '/assets/images/festival/19-577-min.jpg';
        case ApplicationType.essensstand:
            return 'https://place-puppy.com/550x401';
        case ApplicationType.nachbarschaft:
            return '/assets/images/festival/19-154-min.jpg';
    }
};

export default useApplicationTitle;
