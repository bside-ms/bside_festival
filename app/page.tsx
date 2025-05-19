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

                <div className="space-y-3 p-5 text-left text-sm leading-7 text-black">
                    <p className="text-xl font-bold">Es geht wieder los: Das 9. B-Side Festival steht vor der Tür!</p>

                    <p>
                        Dieses Jahr sind wir wieder in der B-Side am Mittelhafen und im Hansaviertel! Ganz nach dem Motto{' '}
                        <strong>B-together, B-loved – B-Side!</strong> möchten wir dieses Jahr ganz besonders die Gemeinschaft, Begegnung
                        und Empathie feiern. Zusammen schaffen wir über den <strong>19. und 20. September</strong> hinweg einen Ort, an dem
                        wir gemeinsam kreativ werden können.
                    </p>

                    <p>
                        Du willst mit deiner Kunst, deinen Texten oder mit deinem Workshop Teil des bunten Programms werden? Deine Musik
                        darf auf gar keinen Fall fehlen? Oder du hast eine spannende Idee, auf die wir bisher noch gar nicht gekommen sind?
                        Dein Beitrag passt zu unserem Motto? Super! Dann bewirb dich bis zu dem 11. Mai auf unserem Bewerbungsportal!
                    </p>

                    <p>
                        Wichtig: Das B-Side Festival ist ein eintrittsfreies, komplett ehrenamtlich organisiertes Festival, das seit 2016
                        versucht, einen Gegenpol zu typischen kommerziellen Musikveranstaltungen zu gestalten. Die konkrete Budgetierung des
                        Festivals ist zu diesem Zeitpunkt noch nicht abgeschlossen, jedoch können wir zur Zeit noch nicht mehr als eine
                        Aufwandsentschädigung zusagen. Wir geben aber unser bestes, hier noch mehr für euch rauszuholen :)
                    </p>
                </div>

                <Footer />
            </div>
        </div>
    );
};
