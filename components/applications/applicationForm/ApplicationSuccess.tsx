import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';

const ApplicationSuccess = (): ReactElement => {

    return (
        <div className="text-black">
            <div className="text-black font-display mb-4">
                <div className="text-2xl">B-Side Festival 2023</div>
                <div className="text-4xl font-bold">Bewerbung</div>
            </div>

            <div className="text-justify">
                Vielen Dank für eure Bewerbung! Bitte bedenkt, dass unsere Bewerbungsphase
                noch läuft. Erst im Anschluss der Bewerbungsphase entscheiden wir uns,
                wer dieses Jahr dabei sein kann. Das Sichten der zahlreichen Bewerbungen dauert
                erfahrungsgemäß mehrere Wochen.<br /><br />
                Schön, dass ihr dabei sein möchtet!
            </div>

            <div className="mt-6">
                <Link href="/" className="md:cursor-pointer">
                    <FontAwesomeIcon icon={faArrowLeft} />&nbsp;&nbsp; zurück zur Startseite
                </Link>
            </div>
        </div>
    );
};

export default ApplicationSuccess;
