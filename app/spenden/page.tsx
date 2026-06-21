import FundraisingBox from '@/components/common/FundraisingBox';
import Link from 'next/link';
import type { ReactElement } from 'react';

const betterplaceUrl = 'https://www.betterplace.org/de/projects/181615-b-side-festival-2026-unterstuetze-die-10-jahre-jubilaeumsausgabe';

const fundraisingboxHash = 'q4orlvmc7mxs7a7p';

export default function SpendenPage(): ReactElement {
    return (
        <div className="relative mx-auto min-h-screen w-full max-w-3xl px-6 pt-5 pb-12">
            <div className="text-center font-display text-5xl uppercase sm:text-6xl">Unterstütze uns</div>

            <div className="mx-auto mt-8 max-w-2xl space-y-4 text-center text-sm text-balance">
                <div className="text-base font-black">Kurzfristig ist uns eine größere Förderung von rund 12.000 Euro weggebrochen.</div>
                <div>
                    Das B-Side Festival ist kostenfrei, non-profit und wird größtenteils ehrenamtlich organisiert. Möglich ist das nur durch
                    Förderungen, viel Engagement und solidarische Unterstützung. Diese Lücke können wir nicht allein auffangen – damit das
                    10-Jahre-Jubiläum am 18. &amp; 19. September wie geplant stattfinden kann, sind wir jetzt auf eure Spenden angewiesen.
                </div>
                <div>
                    Mit deiner Spende hilfst du uns, Künstler*innen fair zu bezahlen, Technik zu finanzieren und Awareness-Arbeit
                    umzusetzen. Du unterstützt Nachwuchsförderung, Diversität auf den Bühnen und Barrierearmut – und hilfst mit, gelebte
                    Soziokultur sowie Kultur und Bildung für alle zu erhalten.
                </div>
            </div>

            <div className="mx-auto mt-10 max-w-xl">
                <div className="mb-4 text-center text-base font-black">Jetzt direkt spenden</div>
                <FundraisingBox hash={fundraisingboxHash} />
            </div>

            <div className="mx-auto mt-8 max-w-2xl space-y-4 text-center text-sm text-balance">
                <div>
                    Lieber über betterplace spenden?{' '}
                    <Link href={betterplaceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-rose-600">
                        Zur Kampagne auf betterplace
                    </Link>
                </div>
                <div className="font-black">Jeder Beitrag zählt – vielen herzlichen Dank! 🖤</div>
            </div>
        </div>
    );
}
