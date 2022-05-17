import Link from 'next/link';
import type { ReactElement } from 'react';
import ApplicationFormMandatoryCheckbox from 'components/application-form/ApplicationFormMandatoryCheckbox';

const ApplicationFormMandatoryCheckboxes = (): ReactElement => {

    const softHyphen = '\u00AD';

    const privacyTermsLink = (
        <Link href="https://b-side.ms/datenschutzerklaerung">
            <a target="_blank" className="underline">Datenschutz{softHyphen}bestimmungen</a>
        </Link>
    );

    return (
        <div className="space-y-4 text-gray-700">
            <ApplicationFormMandatoryCheckbox name="privacyTerms">
                Hiermit akzeptieren wir die {privacyTermsLink}
            </ApplicationFormMandatoryCheckbox>

            <ApplicationFormMandatoryCheckbox name="pictureRights">
                Hiermit übertragen wir dem B-Side Kultur e.V. das einfache, räumlich und zeitlich
                unbeschränkte Nutzungsrecht, die zur Verfügung gestellten und im Rahmen des B-Side
                Festivals entstandenen audiovisuellen Aufnahmen und Fotos auf beliebige Weise in
                beliebigen Medien wie digitalen Medien, einschließlich des Internets, zu bearbeiten
                und zu nutzen.
            </ApplicationFormMandatoryCheckbox>
        </div>
    );
};

export default ApplicationFormMandatoryCheckboxes;
