import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';

const VolunteerSuccess = (): ReactElement => {
    return (
        <div className="flex flex-col gap-8 text-black">
            <div className="font-display text-4xl font-bold">Anmeldung eingegangen</div>

            <div className="rounded-2xl border border-black bg-white p-5 md:p-8">
                <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faEnvelope} className="mt-1.5 w-4 shrink-0" />
                    <div className="flex flex-col gap-2">
                        <h3 className="font-display text-lg font-bold">Bitte E-Mail bestätigen</h3>
                        <p className="leading-relaxed">
                            Deine Anmeldung ist erst abgeschlossen, wenn du deine E-Mail-Adresse bestätigt hast. Dafür solltest du soeben
                            eine Mail mit einem Bestätigungslink bekommen haben. Der Link ist drei Tage gültig. Schau sonst auch im
                            Spam-Ordner nach. Falls die Mail nicht innerhalb der nächsten Stunden ankommt, schreib uns unter{' '}
                            <a href="mailto:festival@b-side.ms" className="underline">
                                festival@b-side.ms
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>

            <p className="leading-relaxed">Schön, dass du dabei sein möchtest — wir melden uns, sobald es mit den Schichten weitergeht.</p>

            <Link href="/" className="w-fit md:cursor-pointer">
                <FontAwesomeIcon icon={faArrowLeft} className="inline-block w-4" />
                &nbsp;&nbsp; zurück zur Startseite
            </Link>
        </div>
    );
};

export default VolunteerSuccess;
