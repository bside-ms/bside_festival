import Link from 'next/link';
import type { ReactElement } from 'react';
import Header from 'components/Header';

export default (): ReactElement => {

    return (
        <div className="w-full md:w-2/3 mx-auto">
            <div className="h-screen relative">
                <div className="relative z-10">
                    <Header />
                </div>

                <div className="absolute top-[100px] left-[50px] font-title1 text-6xl">
                    B-Side Festival
                </div>

                <div className="absolute w-[400px] left-7 font-title2 text-9xl">
                    Zurück für die Zukunft
                </div>
            </div>

            <div className="text-center p-7">
                <div>
                    Nach einem Jahr Pause ist das B-Side Festival in 2022 zurück! Im September erwartet euch
                    wieder ein vielfältiges Programm aus Konzerten, Workshops, Lesungen und vielem mehr.
                </div>

                <div className="pt-5">
                    Auf dieser Website findet ihr vor und auch während des Festivals alle Informationen.
                </div>

                <div className="pt-5">
                    Ihr wollt selbst ein Teil des Programms sein? Sendet uns eure Bewerbung und
                    gestaltet das B-Side Festival 2022 gemeinsam mit uns!
                </div>

                <div className="pt-3">
                    <Link href="/bewerbung" passHref={true}>
                        <button className="bg-white hover:bg-gray-300 text-gray-800 rounded px-3 py-1">
                            Jetzt bewerben
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
