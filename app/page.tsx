import { ReactElement } from 'react';
import Link from 'next/link';
import Footer from 'components/common/Footer';

export default function Home(): ReactElement {
    return (
        <div>
            <div className="relative mx-auto min-h-screen w-full max-w-2xl font-display">
                <div className="py-3 text-center font-bold uppercase tracking-[0.3em] text-[#5ff450]">20. & 21. September 2024</div>

                <div className="h-10 w-full bg-black" />

                <div className="relative h-96 overflow-hidden md:h-[580px]">
                    <div
                        className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 bg-cover bg-center bg-no-repeat opacity-0"
                        style={{ backgroundImage: `url("/assets/2024-bg.webp")` }}
                    />
                </div>

                <div className="py-3 text-center">
                    <div className="font-bold uppercase tracking-[0.3em] text-[#5ff450]">Spielplatz für Kreative</div>
                    <div className="text-xs text-black">Veranstaltet vom B-Side Kultur e.V.</div>
                </div>

                <div className="h-5 w-full bg-black" />

                <Link
                    className="block w-full cursor-pointer select-none bg-[#FDF85D] py-3 text-center font-bold uppercase tracking-[0.3em] text-[#FEC7DB]"
                    href="/programm"
                >
                    zum Programm {'>>'}
                </Link>

                <div className="h-5 w-full bg-[#5ff450]" />

                <div className="p-5 text-left">
                    <div className="font-bold uppercase tracking-[0.3em] text-black">Welcome back</div>

                    <div className="space-y-3 pt-3 text-sm text-black">
                        <p>
                            Die B-Side ist wieder zurück am Mittelhafen! Mit dem B-Side Festival 2024 feiern wir dieses Jahr unter dem Motto{' '}
                            <strong>„Spielplatz für Kreative"</strong> die kulturelle Eröffnung der B-Side.
                        </p>
                        <p>
                            <strong>Vom 20. bis zum 21. September</strong> bietet der B-Side Kultur e.V. ein vielfältiges Angebot aus Musik,
                            Ausstellungen, Performances, Workshops, Lesungen uvm. Alle Menschen sind herzlich eingeladen, an dem bunten,
                            nicht kommerziellen Programm teilzunehmen, es mitzugestalten und das neue soziokulturelle Zentrum zu erkunden.
                            Für Interessierte an den gemeinnützigen Projekten des B-Side Kollektivs sind außerdem Infostände und eine
                            Ausstellung über die B-Side-Geschichte geplant.
                        </p>
                        <p>
                            Das Festival findet dieses Jahr vor allem in den frisch renovierten Räumlichkeiten Am Mittelhafen 42 statt, die
                            anschließende Party ist wie in den Vorjahren in der Sputnikhalle geplant. Um all das zu realisieren, engagieren
                            sich aktuell über 20 Menschen ehrenamtlich, kollektiv und selbstorganisiert im Festival-Team des B-Side Kultur
                            e.V.
                        </p>
                    </div>
                </div>

                <div className="h-5 w-full bg-black" />
                <div className="h-5 w-full bg-[#FEC7DB]" />

                <div className="px-5 py-3 text-left">
                    <div className="font-bold uppercase tracking-[0.3em] text-black">Mithelfen</div>

                    <div className="pt-3 text-sm text-black">
                        Für unser B-Side Festival 2024 brauchen wir euch! Wir suchen tatkräftige Helfer*innen. Dabei gibt es verschiedene
                        Aufgaben, bei denen ihr euch einbringen könnt: Die Betreuung von Konzerten, Workshops, Ausstellungen und Lesungen,
                        die Verpflegung für das Helfer*innen- und B-Side-Team, Hilfe beim Auf- und Abbau und der Technik des Festivals,
                        Unterstützung des Awareness-Teams auf dem gesamten Festival und beim Spendensammeln.
                    </div>

                    <Link
                        className="mt-4 block w-full cursor-pointer select-none bg-[#FEC7DB] py-3 text-center text-sm font-bold uppercase tracking-[0.3em] text-[#FDF85D]"
                        href="/mithelfen"
                    >
                        zum Anmeldeformular {'>>'}
                    </Link>
                </div>

                <div className="h-10 w-full bg-[#5ff450]" />

                <Footer />
            </div>
        </div>
    );
}
