import ApplicationType from 'lib/application-form/ApplicationType';

const useApplicationTypeColor = (type: ApplicationType): string => {

    switch (type) {
        case ApplicationType.ausstellung:
            return '#9bdeac';
        case ApplicationType.performance:
            return '#ffe66d';
        case ApplicationType.konzert:
            return '#ee7f5d';
        case ApplicationType.workshop:
            return '#84dcc6';
        case ApplicationType.familienprogramm:
            return '#4993a9';
        case ApplicationType.lesung:
            return '#80a25b';
        case ApplicationType.essensstand:
            return '#ab49b4';
        case ApplicationType.nachbarschaft:
            return '#8370bb';
        case ApplicationType.anderes:
            return '#e82b63';
    }
};

export default useApplicationTypeColor;
