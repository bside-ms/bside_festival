import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { HiExclamationCircle } from 'react-icons/hi';

const ApplicationSuccess = (): ReactElement => {
    return (
        <div className="text-black">
            <div className="mb-4 font-display">
                <div className="text-4xl font-bold">Bewerbung eingegangen</div>
            </div>

            <div className="mb-8 animate-in border-l-4 border-red-600 bg-red-50 p-4 shadow-sm duration-500 fade-in slide-in-from-top-4">
                <div className="flex items-start gap-3">
                    <HiExclamationCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                    <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-bold tracking-tight text-red-900 uppercase">Wichtiger Hinweis!</h3>
                        <p className="text-sm leading-relaxed text-red-800">
                            Eure Bewerbung ist erst abgeschlossen, wenn ihr eure E-Mail Adresse verifiziert habt. Dafür solltet ihr soeben
                            eine Mail mit einem Bestätigungslink erhalten haben. Der darin enthaltenen Link ist 3 Tage gültig. Überprüft
                            auch euren Spam-Ordner. Solltet ihr diese Bestätigungs-Mail nicht innerhalb der nächsten 12 Stunden erhalten
                            haben, kontaktiert uns bitte unter festival@b-side.ms mit dem Betreff "E-Mail Verifikation [Euer Projektname]"
                            oder via{' '}
                            <Link href="https://www.instagram.com/bside.festival.ms/" target="_blank">
                                <u>Social Media</u>
                            </Link>
                            .
                        </p>
                    </div>
                </div>
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
