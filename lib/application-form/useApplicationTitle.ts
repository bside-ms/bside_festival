import ApplicationType from 'lib/application-form/ApplicationType';

const useApplicationTitle = (applicationType: ApplicationType): string => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
            return 'Ausstellung';
        case ApplicationType.performance:
            return 'Performance, Theater & Kabarett';
        case ApplicationType.konzert:
            return 'Konzert';
        case ApplicationType.workshop:
            return 'Workshop / (interaktiver) Infostand';
        case ApplicationType.familienprogramm:
            return 'Familienprogramm';
        case ApplicationType.lesung:
            return 'Lesung, Vortrag & Poesie';
        case ApplicationType.essensstand:
            return 'Essensstand';
        case ApplicationType.nachbarschaf:
            return 'Nachbarschaft';
    }
};

export default useApplicationTitle;
