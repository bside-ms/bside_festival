import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';

const ApplicationSuccess = (): ReactElement => {
    return (
        <div className="text-white">
            <div className="mb-4 font-display">
                <div className="text-4xl font-bold">Bewerbung</div>
            </div>

            <div className="text-justify">
                Vielen Dank für eure Bewerbung! Bitte bedenkt, dass unsere Bewerbungsphase noch läuft. Erst im Anschluss der Bewerbungsphase
                entscheiden wir uns, wer dieses Jahr dabei sein kann. Das Sichten der zahlreichen Bewerbungen dauert erfahrungsgemäß mehrere
                Wochen.
                <br />
                <br />
                Schön, dass ihr dabei sein möchtet!
            </div>

            <div className="mt-6">
                <Link href="/" className="md:cursor-pointer">
                    <FontAwesomeIcon icon={faArrowLeft} className="inline-block w-4" />
                    &nbsp;&nbsp; zurück zur Startseite
                </Link>
            </div>
        </div>
    );
};

export default ApplicationSuccess;
