import MailParagraph from '@/components/mail/MailParagraph';
import MailWireframe from '@/components/mail/MailWireframe';
import isNotEmptyString from '@/lib/common/helper/isNotEmptyString';
import typeLabels from '@/lib/participants/typeLabels';
import type { Participant } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    title: string;
    application: Participant;
    links: Array<string>;
}

const ApplicationConfirmationMail = ({ application, links, title }: Props): ReactElement => {
    const {
        type,
        description,
        name,
        motivation,
        additionalInfo,
        contactMail,
        contactName,
        contactPhone,
        address,
        residence,
        technicalRider,
        technicalRiderFileName,
        backlineSharing,
        materialExpenses,
    } = application;

    return (
        <MailWireframe title={title}>
            <MailParagraph>
                Vielen Dank für eure Bewerbung und euer Interesse, Teil des diesjährigen B-Side Festivals zu sein.
            </MailParagraph>

            <MailParagraph>
                Hier eine kurze Zusammenfassung eurer Bewerbung:
                <br />
                <br />
                <strong>Typ:</strong>
                <br />
                {typeLabels[type]}
                <br />
                <br />
                <strong>Name:</strong>
                <br />
                {name}
                <br />
                {isNotEmptyString(description) && (
                    <>
                        <br />
                        <strong>Beschreibung:</strong>
                        <br />
                        {description}
                        <br />
                    </>
                )}
                {isNotEmptyString(motivation) && (
                    <>
                        <br />
                        <strong>Motivation:</strong>
                        <br />
                        {motivation}
                        <br />
                    </>
                )}
                {isNotEmptyString(additionalInfo) && (
                    <>
                        <br />
                        <strong>Zusätzliche Info:</strong>
                        <br />
                        {additionalInfo}
                        <br />
                    </>
                )}
                {(isNotEmptyString(technicalRider) || isNotEmptyString(technicalRiderFileName)) && (
                    <>
                        <br />
                        <strong>Technical Rider:</strong>
                        <br />
                        {isNotEmptyString(technicalRider) && (
                            <>
                                {technicalRider}
                                <br />
                            </>
                        )}
                        {isNotEmptyString(technicalRiderFileName) && (
                            <>
                                (PDF bereitgestellt)
                                <br />
                            </>
                        )}
                    </>
                )}
                {isNotEmptyString(backlineSharing) && (
                    <>
                        <br />
                        <strong>Backline-Sharing:</strong>
                        <br />
                        {backlineSharing}
                        <br />
                    </>
                )}
                {isNotEmptyString(materialExpenses) && (
                    <>
                        <br />
                        <strong>Materialkosten:</strong>
                        <br />
                        {materialExpenses}
                        <br />
                    </>
                )}
                {links.length > 0 && (
                    <>
                        <br />
                        <strong>Links:</strong>
                        <br />
                        {links.map((link) => (
                            <>
                                {link}
                                <br />
                            </>
                        ))}
                    </>
                )}
                {isNotEmptyString(contactName) && (
                    <>
                        <br />
                        <strong>Ansprechperson:</strong>
                        <br />
                        {contactName}
                        <br />
                    </>
                )}
                {isNotEmptyString(contactMail) && (
                    <>
                        <br />
                        <strong>E-Mail-Adresse:</strong>
                        <br />
                        {contactMail}
                        <br />
                    </>
                )}
                {isNotEmptyString(contactPhone) && (
                    <>
                        <br />
                        <strong>Telefonnummer:</strong>
                        <br />
                        {contactPhone}
                        <br />
                    </>
                )}
                {isNotEmptyString(address) && (
                    <>
                        <br />
                        <strong>Adresse:</strong>
                        <br />
                        {address}
                        <br />
                    </>
                )}
                {isNotEmptyString(residence) && (
                    <>
                        <br />
                        <strong>Wohnort:</strong>
                        <br />
                        {residence}
                        <br />
                    </>
                )}
            </MailParagraph>

            <MailParagraph>
                Zusammen mit den vielen anderen Bewerbungen werden wir diese bald sichten und uns im Anschluss bei euch melden!
            </MailParagraph>
        </MailWireframe>
    );
};

export default ApplicationConfirmationMail;
