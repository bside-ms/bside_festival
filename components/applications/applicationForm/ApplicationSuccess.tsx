import Link from 'next/link';
import type { ReactElement } from 'react';

const ApplicationSuccess = (): ReactElement => {

    return (
        <div className="text-gray-100">
            Vielen Dank für eure Bewerbung! Wir haben euch eine Bestätigung an die angegebene
            E-Mail-Adresse geschickt. Schon bald werden wir eure und die vielen weiteren
            Bewerbungen sichten und uns im Anschluss bei euch melden!

            <div className="mt-6">
                <Link href="/" className="md:cursor-pointer underline">zurück zur Startseite</Link>
            </div>
        </div>
    );
};

export default ApplicationSuccess;
