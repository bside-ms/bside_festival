import type ApplicationFormField from 'lib/application-form/ApplicationFormField';
import ApplicationFormFieldType from 'lib/application-form/ApplicationFormFieldType';
import ApplicationType from 'lib/application-form/ApplicationType';

const nameField: ApplicationFormField = {
    type: ApplicationFormFieldType.text,
    name: 'name',
    label: 'Name',
    info: 'Wie soll euer Programmpunkt im Programmheft heißen?',
};

const participantsField: ApplicationFormField = {
    type: ApplicationFormFieldType.text,
    name: 'participants',
    label: 'Wer macht alles mit?',
};

const photoField: ApplicationFormField = {
    type: ApplicationFormFieldType.imageUpload,
    name: 'photo',
    label: 'Euer Foto',
    info: `
        Beachtet: Dieses Foto wird auf unserer Webseite 
        veröffentlicht, falls ihr beim B-Side Festival 
        dabei sein werdet. Bitte sendet nur neutrale Fotos 
        ohne Text & Logos.
    `,
};

const motivationField: ApplicationFormField = {
    type: ApplicationFormFieldType.textArea,
    name: 'motivation',
    label: 'Motivation',
    info: 'Warum möchtet ihr Teil des B-Side Festivals 2022 sein?',
};

const residenceField: ApplicationFormField = {
    type: ApplicationFormFieldType.text,
    name: 'residence',
    label: 'Wohnort',
};

const pressReleaseField: ApplicationFormField = {
    type: ApplicationFormFieldType.textArea,
    name: 'pressRelease',
    label: 'Erzählt uns was von euch',
    info: `
        Beachtet: Dies ist ein Pressetext. 
        Dieser Text wird auf unserer Webseite 
        veröffentlicht, falls ihr beim B-Side
        Festival dabei sein werdet.
    `,
};

const contactPersonField: ApplicationFormField = {
    type: ApplicationFormFieldType.text,
    name: 'contactPerson',
    label: 'Ansprechperson',
};

const mailAddressField: ApplicationFormField = {
    type: ApplicationFormFieldType.text,
    name: 'mailAddress',
    label: 'E-Mail-Adresse',
};

const phoneNumberField: ApplicationFormField = {
    type: ApplicationFormFieldType.text,
    name: 'phoneNumber',
    label: 'Telefonnummer',
};

const contactFields = [contactPersonField, mailAddressField, phoneNumberField];

export const useApplicationFormFields = (applicationType: ApplicationType): Array<ApplicationFormField> => {

    switch (applicationType) {
        case ApplicationType.ausstellung:
            return [
                nameField,
                participantsField,
                pressReleaseField,
                {
                    type: ApplicationFormFieldType.text,
                    name: 'link',
                    label: 'Eure Links mit Bildbeispielen',
                    info: 'Website, Social Media, etc. (Bitte keine Download-Links)',
                },
                photoField,
                motivationField,
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'additionalInfo',
                    label: 'Informationen zur Ausstellung',
                    info: 'Technical Rider/Kunstform/Anzahl und Formate deiner Werke',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.performance:
            return [
                nameField,
                participantsField,
                pressReleaseField,
                {
                    type: ApplicationFormFieldType.text,
                    name: 'link',
                    label: 'Eure Links mit Bild- und Tonbeispielen',
                    info: ' Website, Social Media, Soundcloud, etc. (Bitte keine Download-Links)',
                },
                photoField,
                motivationField,
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'technicalRider',
                    label: 'Technical Rider',
                    info: `
                        Welche technische Ausstattung braucht ihr? Zum Beispiel Mikrofone, Licht, … Wie viel Platz 
                        braucht ihr auf der Bühne? Seid so genau wie möglich. Kennzeichnet was 
                        ihr selber mitbringt und was ihr von uns braucht. Ladet optional zusätzlich
                        eine PDF-Datei hoch.
                    `,
                },
                {
                    type: ApplicationFormFieldType.pdfUpload,
                    name: 'technicalRiderPdf',
                    label: 'Technical Rider',
                    optional: true,
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.konzert:
            return [
                nameField,
                participantsField,
                pressReleaseField,
                {
                    type: ApplicationFormFieldType.text,
                    name: 'link',
                    label: 'Eure Links mit Tonbeispielen',
                    info: 'Website, Social Media, Soundcloud, etc. (Bitte keine Download-Links)',
                },
                photoField,
                motivationField,
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'technicalRider',
                    label: 'Technical Rider',
                    info: `
                        Welche Instrumente habt ihr auf der Bühne? Welche technische Ausstattung 
                        braucht ihr? Zum Beispiel Verstärker, Mikrofone, Licht, … Wie viel Platz 
                        braucht ihr auf der Bühne? Seid so genau wie möglich. Kennzeichnet was 
                        ihr selber mitbringt und was ihr von uns braucht. Ladet optional zusätzlich
                        eine PDF-Datei hoch.
                    `,
                },
                {
                    type: ApplicationFormFieldType.pdfUpload,
                    name: 'technicalRiderPdf',
                    label: 'Technical Rider',
                    optional: true,
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.workshop:
        case ApplicationType.infostand:
            return [
                nameField,
                participantsField,
                pressReleaseField,
                {
                    type: ApplicationFormFieldType.text,
                    name: 'link',
                    label: 'Website/Social Media',
                },
                photoField,
                motivationField,
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'additionalInfo',
                    label: 'Informationen zum Workshop',
                    info: 'Teilnehmendenanzahl/empfohlene Altersgruppe/Dauer des Programms/technische Voraussetzungen',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.familienprogramm:
            return [
                nameField,
                participantsField,
                pressReleaseField,
                {
                    type: ApplicationFormFieldType.text,
                    name: 'link',
                    label: 'Website/Social Media',
                },
                photoField,
                motivationField,
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'additionalInfo',
                    label: 'Informationen zum Programm',
                    info: 'Teilnehmendenanzahl/empfohlene Altersgruppe/Dauer des Programms/technische Voraussetzungen',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.lesung:
            return [
                nameField,
                participantsField,
                pressReleaseField,
                {
                    type: ApplicationFormFieldType.text,
                    name: 'link',
                    label: 'Eure Links mit Tonbeispielen',
                    info: 'Website, Social Media, Soundcloud, etc. (Bitte keine Download-Links)',
                },
                photoField,
                motivationField,
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'technicalRequirements',
                    label: 'Technische Voraussetzungen',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.essensstand:
            return [
                nameField,
                participantsField,
                pressReleaseField,
                {
                    type: ApplicationFormFieldType.text,
                    name: 'link',
                    label: 'Website/Social Media',
                },
                photoField,
                motivationField,
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'technicalRequirements',
                    label: 'Technische Voraussetzungen',
                },
                residenceField,
                ...contactFields,
            ];

        case ApplicationType.nachbarschaft:
            return [
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'name',
                    label: 'Wer seid ihr?',
                },
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'info',
                    label: 'Wie möchtet ihr euch beim diesjährigen Festival einbringen?',
                },
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'usableArea',
                    label: 'Nutzungsraum',
                    info: 'Welchen Nutzungsraum könnt ihr für das diesjährige Festival zur Verfügung stellen?',
                },
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'additionalInfo',
                    label: 'Was möchtet ihr uns noch mitteilen?',
                },
                {
                    type: ApplicationFormFieldType.text,
                    name: 'address',
                    label: 'Straße und Hausnummer',
                },
                mailAddressField,
                phoneNumberField,
            ];

        case ApplicationType.anderes:
            return [
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'name',
                    label: 'Wer seid ihr?',
                },
                {
                    type: ApplicationFormFieldType.textArea,
                    name: 'info',
                    label: 'Erzählt uns von eurer Idee!',
                },
                residenceField,
                ...contactFields,
            ];
    }
};
