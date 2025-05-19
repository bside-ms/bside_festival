import Footer from 'components/common/Footer';
import backgroundImage from 'images/background2025.webp';
import Image from 'next/image';
import { ReactElement } from 'react';

export default (): ReactElement => {
    return (
        <div>
            <div className="relative mx-auto min-h-screen w-full max-w-2xl font-display">
                <div className="py-3 text-center font-bold tracking-[0.3em] text-red-600 uppercase">19. & 20. September 2025</div>

                <Image src={backgroundImage} alt="Festival-Plakat" className="object-cover" />

                <div className="py-3 text-center">
                    <div className="text-xs text-black">Veranstaltet vom B-Side Kultur e.V.</div>
                </div>

                <div className="h-1 w-full bg-red-600" />

                <div className="space-y-3 p-5 text-justify text-sm leading-7 text-black">
                    <p className="text-xl font-bold">Es geht wieder los: Das 9. B-Side Festival rückt näher!</p>

                    <p>
                        Dieses Jahr sind wir wieder in der B-Side am Mittelhafen und im Hansaviertel! Ganz nach dem Motto{' '}
                        <strong>B-together, B-loved – B-Side!</strong> möchten wir besonders die Gemeinschaft, Begegnung und Empathie
                        feiern. Über den <strong>19. und 20. September</strong> erschaffen wir gemeinsam einen Ort voller Kreativität und
                        Miteinander.
                    </p>

                    <p>
                        Die Bewerbungsphase ist nun beendet – und wir sind überwältigt! Zahlreiche tolle Bewerbungen haben uns erreicht,
                        voller spannender Ideen, Kunst, Musik und Workshops. Wir freuen uns riesig über eure Kreativität und das Vertrauen
                        in unser Festival.
                    </p>

                    <p>
                        Jetzt nehmen wir uns Zeit, alle Einsendungen sorgfältig zu sichten und melden uns bald bei euch, wenn wir mit der
                        Programmplanung ein Stück weiter sind. Danke für euren Beitrag zum B-Side Festival 2025!
                    </p>

                    <p>
                        Wichtig: Das B-Side Festival ist ein eintrittsfreies, komplett ehrenamtlich organisiertes Festival, das seit 2016
                        versucht, einen Gegenpol zu typischen kommerziellen Musikveranstaltungen zu gestalten. Die konkrete Budgetierung des
                        Festivals ist zu diesem Zeitpunkt noch nicht abgeschlossen, jedoch können wir zur Zeit noch nicht mehr als eine
                        Aufwandsentschädigung zusagen. Wir geben aber unser Bestes, hier noch mehr für euch rauszuholen :)
                    </p>
                </div>

                <Footer />
            </div>
        </div>
    );
};
