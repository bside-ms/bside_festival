
export enum ApplicationType {
    exhibition = 'exhibition',
    performance = 'performance',
    concert = 'concert',
    workshop = 'workshop',
    familyProgram = 'familyProgram',
    reading = 'reading',
    food = 'food',
    neighborhood = 'neighborhood',
}

export const applicationTypes = new Array<{ type: ApplicationType, title: string, pathPart: string }>(
    { type: ApplicationType.exhibition, title: 'Ausstellung', pathPart: 'ausstellung' },
    { type: ApplicationType.performance, title: 'Performance, Theater & Kabarett', pathPart: 'performance' },
    { type: ApplicationType.concert, title: 'Konzert', pathPart: 'konzert' },
    { type: ApplicationType.workshop, title: 'Workshop / (interaktiver) Infostand', pathPart: 'workshop' },
    { type: ApplicationType.familyProgram, title: 'Familienprogramm', pathPart: 'familienprogramm' },
    { type: ApplicationType.reading, title: 'Lesung, Vortrag & Poesie', pathPart: 'lesung' },
    { type: ApplicationType.food, title: 'Essensstand', pathPart: 'essensstand' },
    { type: ApplicationType.neighborhood, title: 'Nachbarschaft', pathPart: 'nachbarschaft' }
);

export enum FieldType {
    text = 'text',
    textArea = 'textArea',
    upload = 'upload',
}

export const getApplicationTypeByPathPart = (searchedPathPart: string): ApplicationType | undefined => (
    applicationTypes.find(({ pathPart }) => pathPart === searchedPathPart)?.type
);

export interface ApplicationField {
    name: string;
    type: FieldType;
    label: string;
    mandatory?: boolean;
    info?: string;
}

const participantsField: ApplicationField = {
    type: FieldType.text,
    name: 'participants',
    label: 'Wer macht alles mit?',
};

const photoField: ApplicationField = {
    type: FieldType.upload,
    name: 'photo',
    label: 'Euer Foto',
};

const motivationField: ApplicationField = {
    type: FieldType.textArea,
    name: 'motivation',
    label: 'Warum möchtet ihr Teil des B-Side Festivals 2022 sein?',
};

const residenceField: ApplicationField = {
    type: FieldType.text,
    name: 'residence',
    label: 'Wohnort',
};

const pressReleaseField: ApplicationField = {
    type: FieldType.textArea,
    name: 'pressRelease',
    label: 'Erzählt uns was von euch (Pressetext)',
    mandatory: true,
};

const contactPersonField: ApplicationField = {
    type: FieldType.text,
    name: 'contactPerson',
    label: 'Ansprechperson',
    mandatory: true,
};

const mailAddressField: ApplicationField = {
    type: FieldType.text,
    name: 'mailAddress',
    label: 'E-Mail-Adresse',
    mandatory: true,
};

const phoneNumberField: ApplicationField = {
    type: FieldType.text,
    name: 'phoneNumber',
    label: 'Telefonnummer',
    mandatory: true,
};

const contactFields = [contactPersonField, mailAddressField, phoneNumberField];

export const useApplicationFields = (type: ApplicationType): Array<ApplicationField> => {

    switch (type) {
        case ApplicationType.exhibition:
            return [
                participantsField,
                pressReleaseField,
                {
                    type: FieldType.text,
                    name: 'link',
                    label: 'Euer Link mit Bildbeispielen (Website, Social Media, ...)',
                    info: 'Bitte keine Downloads, WETransfer, etc.',
                },
                photoField,
                motivationField,
                {
                    type: FieldType.textArea,
                    name: 'technicalRider',
                    label: 'Technical Rider/Kunstform/Anzahl und Formate deiner Werke',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.performance:
            return [
                participantsField,
                pressReleaseField,
                {
                    type: FieldType.text,
                    name: 'link',
                    label: 'Euer Link mit Bild- und Tonbeispielen (Website, Social Media, Soundcloud, ...)',
                    info: 'Bitte keine Downloads, WETransfer, etc.',
                },
                photoField,
                motivationField,
                {
                    type: FieldType.textArea,
                    name: 'technicalRider',
                    label: 'Technical Rider',
                    mandatory: true,
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.concert:
            return [
                participantsField,
                pressReleaseField,
                {
                    type: FieldType.text,
                    name: 'link',
                    label: 'Euer Link mit Tonbeispielen (Website, Social Media, Soundcloud, ...)',
                    info: 'Bitte keine Downloads, WETransfer, etc.',
                },
                photoField,
                motivationField,
                {
                    type: FieldType.textArea,
                    name: 'technicalRider',
                    label: 'Technical Rider',
                    mandatory: true,
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.workshop:
            return [
                participantsField,
                pressReleaseField,
                {
                    type: FieldType.text,
                    name: 'link',
                    label: 'Website/Social Media',
                },
                photoField,
                motivationField,
                {
                    type: FieldType.textArea,
                    name: 'additionalInfo',
                    label: 'Teilnehmendenanzahl/empfohlene Altersgruppe/Dauer des Programms/technische Voraussetzungen',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.familyProgram:
            return [
                participantsField,
                pressReleaseField,
                {
                    type: FieldType.text,
                    name: 'link',
                    label: 'Website/Social Media',
                },
                photoField,
                motivationField,
                {
                    type: FieldType.textArea,
                    name: 'additionalInfo',
                    label: 'Teilnehmendenanzahl/empfohlene Altersgruppe/Dauer des Programms/technische Voraussetzungen',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.reading:
            return [
                participantsField,
                pressReleaseField,
                {
                    type: FieldType.text,
                    name: 'link',
                    label: 'Euer Link mit Tonbeispielen (Website, Social Media, Soundcloud, ...)',
                    info: 'Bitte keine Downloads, WETransfer, etc.',
                },
                photoField,
                motivationField,
                {
                    type: FieldType.textArea,
                    name: 'technicalRequirements',
                    label: 'Technische Voraussetzungen',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.food:
            return [
                participantsField,
                pressReleaseField,
                {
                    type: FieldType.text,
                    name: 'link',
                    label: 'Website/Social Media',
                },
                photoField,
                motivationField,
                {
                    type: FieldType.textArea,
                    name: 'technicalRequirements',
                    label: 'Technische Voraussetzungen',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.neighborhood:
            return [
                {
                    type: FieldType.textArea,
                    name: 'info',
                    label: 'Wie möchtet ihr euch beim diesjährigen Festival einbringen?',
                },
                {
                    type: FieldType.textArea,
                    name: 'additionalInfo',
                    label: 'Was möchtet ihr uns noch mitteilen?',
                },
                {
                    type: FieldType.textArea,
                    name: 'usableArea',
                    label: 'Welchen Nutzungsraum könnt ihr für das diesjährige Festival zur Verfügung stellen?',
                },
                {
                    type: FieldType.text,
                    name: 'address',
                    label: 'Straße und Hausnummer',
                },
                mailAddressField,
                phoneNumberField,
            ];
    }
};
