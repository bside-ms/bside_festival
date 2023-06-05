import { faSmile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';

const ApplicationSuccess = (): ReactElement => {

    return (
        <div className="text-gray-100">
            Vielen Dank für eure Bewerbung! Bitte bedenkt, dass unsere Bewerbungsphase
            noch bis Ende Juni läuft. Erst im Anschluss der Bewerbungsphase entscheiden wir uns,
            wer dieses Jahr dabei sein kann. Das Sichten der zahlreichen Bewerbungen dauert
            erfahrungsgemäß mehrere Wochen.<br /><br />
            Schön, dass ihr dabei sein möchtet! <FontAwesomeIcon icon={faSmile} />

            <div className="mt-6">
                <Link href="/" className="md:cursor-pointer underline">zurück zur Startseite</Link>
            </div>
        </div>
    );
};

export default ApplicationSuccess;
