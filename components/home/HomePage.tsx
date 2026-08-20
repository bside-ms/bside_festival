import Gallery from '@/components/home/Gallery';
import HomeBuilding from '@/components/home/HomeBuilding';
import HomeHero from '@/components/home/HomeHero';
import VolunteersCtaMarks from '@/components/home/VolunteersCtaMarks';
import introNeonHeart from '@/images/2026/home/intro-neon-heart.jpg';
import { betterplaceUrl, bsideOrte, hansaviertelOrte, homeAddress, homeStatsLine, sputnikOrt } from '@/lib/public/homeContent';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';

const sectionPad = 'relative mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-24';

// Die Orte und Mitwirken — still in progress; set true when they are ready to show.
const showDraftHomeSections = false;

const HomePage = (): ReactElement => {
    return (
        <div className="overflow-x-hidden font-display text-black">
            <HomeHero />

            <section className="relative z-0 bg-[#FABF74] text-[#2C2E83]">
                <div className={`${sectionPad} grid gap-10 md:grid-cols-2 md:items-center`}>
                    <div className="space-y-5 text-sm leading-relaxed md:text-base">
                        <div className="text-xs font-bold tracking-[0.2em] text-[#EA504C] uppercase">Wir feiern mit euch</div>
                        <h2 className="text-3xl font-black sm:text-4xl lg:text-[2.35rem] lg:whitespace-nowrap xl:text-[2.75rem]">
                            10 Jahre B-Side Festival
                        </h2>
                        <p className="text-balance">
                            Die B-Side ist der Ort in Münster für alternative Kultur und Community. Das Festival bringt aufstrebende
                            Musiker*innen, Künstler*innen und neugierige Menschen zusammen. Freut euch mit uns auf zwei Tage voller
                            Entdeckungen, Begegnungen und kollektiver Energie bei der Jubiläumsausgabe: 10 Jahre B-Side Festival. Eintritt
                            frei (exkl. Aftershow-Party).
                        </p>
                        <div className="space-y-4 pt-2">
                            <div>
                                <div className="text-2xl font-semibold text-white">18. September ab 17 Uhr</div>
                                <div>in der B-Side, {homeAddress}</div>
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-white">19. September ab 13 Uhr</div>
                                <div>in der B-Side und im Hansaviertel</div>
                                <div className="font-bold">ab 22 Uhr Aftershow-Party in der Sputnikhalle</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative min-h-72 overflow-hidden rounded-sm md:min-h-112">
                        <Image
                            src={introNeonHeart}
                            alt="Neonherz an der B-Side und Festivalbesucher*innen am Abend"
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                </div>
            </section>

            <section className="relative z-10 bg-[#e23b3b] text-white">
                <VolunteersCtaMarks />
                <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center px-6 py-20 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:px-10 md:py-24">
                    <div className="pointer-events-none hidden md:block" />
                    <div className="mx-auto max-w-[16.5rem] text-center sm:max-w-sm md:max-w-none">
                        <div className="text-sm font-bold tracking-wide uppercase opacity-80">
                            Mach das B-Side Festival zu deinem Festival
                        </div>
                        <h2 className="mt-3 text-5xl leading-[0.95] font-black text-[#2C2E83] sm:text-6xl md:text-7xl">
                            <span className="block md:inline">Werde</span> <span className="block md:inline">Helfer*in</span>
                        </h2>
                        <Link
                            href="/mithelfen"
                            className="mt-8 inline-block rounded-full bg-[#2C2E83] px-8 py-3 text-lg font-bold text-white no-underline hover:bg-black sm:px-10 sm:text-xl"
                        >
                            Jetzt mitmachen
                        </Link>
                    </div>
                    <div className="pointer-events-none hidden md:block" />
                </div>
            </section>

            {showDraftHomeSections && (
                <section id="wo-und-wann" className="relative scroll-mt-16 overflow-hidden bg-[#3aa0e8] text-black">
                    <div className="pointer-events-none absolute top-16 right-0 h-40 w-56 rounded-[48%] bg-white/50 blur-sm" />
                    <div className={sectionPad}>
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <div className="text-xs font-bold tracking-[0.2em] uppercase">Wo &amp; Wann 2026</div>
                                <h2 className="mt-2 text-4xl font-black sm:text-5xl md:text-6xl">Die Orte</h2>
                            </div>
                            <div className="text-sm font-bold md:text-base">{homeStatsLine}</div>
                        </div>

                        <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-center">
                            <HomeBuilding />
                            <div className="relative rounded-3xl bg-white/55 p-6 backdrop-blur-sm md:p-8">
                                <h3 className="text-2xl font-black md:text-3xl">B-Side (Freitag &amp; Samstag)</h3>
                                <p className="mt-2 text-sm">{homeAddress}</p>
                                <ul className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                    {bsideOrte.map((ort) => (
                                        <li key={ort} className="font-bold">
                                            {ort}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-16 grid gap-8 md:grid-cols-2 md:items-start">
                            <div>
                                <h3 className="text-2xl font-black md:text-3xl">Hansaviertel (Samstag)</h3>
                                <ul className="mt-5 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                    {hansaviertelOrte.map((ort) => (
                                        <li key={ort} className="font-bold">
                                            {ort}
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-5 text-sm font-bold">{sputnikOrt}</p>
                            </div>
                            <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-sm bg-[#1d2a6b]/10">
                                <Image
                                    src="https://picsum.photos/seed/bside-map/900/600"
                                    alt=""
                                    fill
                                    className="object-cover opacity-35"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="relative z-10 rounded-full bg-white/90 px-5 py-2 text-sm font-black">Karte folgt</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {showDraftHomeSections && (
                <section id="mitwirken" className="relative scroll-mt-16 overflow-hidden bg-[#e23b3b] text-white">
                    <div className="pointer-events-none absolute -right-10 -bottom-16 h-56 w-72 rounded-[45%] bg-[#1d2a6b]/25" />
                    <div className={sectionPad}>
                        <div className="max-w-3xl">
                            <div className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">Mitwirken</div>
                            <h2 className="mt-2 text-3xl font-black sm:text-4xl md:text-5xl">Werde Teil des B-Side Festivals</h2>
                            <p className="mt-4 text-sm leading-relaxed text-balance opacity-95 md:text-base">
                                Das B-Side Festival lebt durch seine Community! Möchtest du die Jubiläumsausgabe unterstützen? Dann werde
                                Teil unserer Crew. Jede*r ist willkommen! Der Open Call für Programmbeiträge ist abgeschlossen. Für
                                Workshops kannst du dich später hier anmelden.
                            </p>
                        </div>

                        <div className="mt-10 grid gap-6 md:grid-cols-2">
                            <div className="rounded-sm bg-white p-6 text-black md:p-8">
                                <h3 className="text-xl font-black">Unsere Helfis</h3>
                                <p className="mt-3 text-sm leading-relaxed">
                                    Werde Teil unserer Crew und gestalte das B-Side Festival mit! Wir suchen Helfer*innen in vielen
                                    Bereichen, z.B. Bühnen und Locations, Technik, Logistik, Awareness-Arbeit, Deko, Fundraising. Freier
                                    Eintritt zur Aftershow, Crew-Raum, neue Freundschaften und jede Menge good Vibes inklusive.
                                </p>
                                <Link href="/mithelfen" className="mt-6 inline-block text-sm font-bold underline hover:text-[#e23b3b]">
                                    Jetzt anmelden →
                                </Link>
                            </div>
                            <div className="rounded-sm bg-white p-6 text-black md:p-8">
                                <h3 className="text-xl font-black">Musik, Kunst &amp; Kultur</h3>
                                <p className="mt-3 text-sm leading-relaxed">
                                    Der Open Call ist abgeschlossen, das Programm 2026 wird in Kürze bekannt gegeben – und wir freuen uns
                                    auf alle, die das Festival bereichern werden mit: Musik, Kunst, Performance, Theater, Lesung, Poesie,
                                    Vortrag, Workshop, Ausstellung, Familienprogramm, Infostand uvm.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section id="ueber-uns" className="relative z-20 scroll-mt-16 bg-[#D681B4]">
                <div className={sectionPad}>
                    <div className="text-xs font-bold tracking-[0.2em] text-[#2C2E83] uppercase">Über uns</div>
                    <h2 className="mt-2 text-4xl font-black text-white sm:text-5xl md:text-6xl">Info</h2>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        <div className="rounded-sm bg-[#2C2E83] p-6 text-white md:p-7">
                            <h3 className="text-lg font-black">Über das B-Side Festival</h3>
                            <p className="mt-3 text-sm leading-7">
                                Der gemeinnützige B-Side Kultur e.V. veranstaltet das B-Side Festival mit rund 20 Ehrenamtlichen im
                                Orga-Team und etwa 100 freiwilligen Helfer*innen. 2016 fand das erste Festival statt – 2026 feiern wir schon
                                10-jähriges Jubiläum mit euch! Das B-Side Festival ist heute eines der wichtigsten und offensten
                                Kulturprojekte in Münster.
                            </p>
                            <p className="mt-3 text-sm leading-7">
                                Ihr möchtet euch auch im Orga-Team engagieren? Oder auch darüber hinaus im Programm des Vereins mit
                                Konzerten, Workshops, Ausstellungen uvm. einbringen? Dann schreibt an:{' '}
                                <a href="mailto:festival@b-side.ms" className="font-bold text-[#40A8F5] no-underline hover:opacity-80">
                                    festival@b-side.ms
                                </a>{' '}
                                |{' '}
                                <a href="mailto:kultur@b-side.ms" className="font-bold text-[#40A8F5] no-underline hover:opacity-80">
                                    kultur@b-side.ms
                                </a>
                            </p>
                        </div>

                        <div className="rounded-sm bg-[#2C2E83] p-6 text-white md:p-7">
                            <h3 className="text-lg font-black">Spenden</h3>
                            <p className="mt-3 text-sm leading-7">
                                Eine wichtige Förderung ist kurzfristig weggefallen – jetzt brauchen wir deine Unterstützung! Hilf mit, das
                                10-Jahre-Jubiläum des B-Side Festivals zu ermöglichen und Kultur und Bildung für alle zu erhalten. Vielen
                                herzlichen Dank!
                            </p>
                            <Link
                                href="/spenden"
                                className="mt-6 inline-block text-sm font-bold text-[#40A8F5] no-underline hover:opacity-80"
                            >
                                Zur Spendenseite →
                            </Link>
                            <div className="mt-2">
                                <Link
                                    href={betterplaceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-bold text-[#40A8F5] no-underline hover:opacity-80"
                                >
                                    Oder betterplace-Kampagne
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-sm bg-[#2C2E83] p-6 text-white md:p-7">
                            <h3 className="text-lg font-black">Awareness</h3>
                            <p className="mt-3 text-sm leading-7">
                                Die B-Side ist ein bewusst geschützter Safer Space. Vor Ort ist ein speziell geschultes Awareness-Team im
                                Einsatz. Diskriminierung, Belästigung, Ausgrenzung und aggressives Verhalten werden in keiner Form
                                toleriert.
                            </p>
                            <Link
                                href="/awareness"
                                className="mt-6 inline-block text-sm font-bold text-[#40A8F5] no-underline hover:opacity-80"
                            >
                                Mehr zu Awareness →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="eindruecke" className="scroll-mt-16 bg-[#FABF74]">
                <div className={sectionPad}>
                    <div className="text-xs font-bold tracking-[0.2em] text-[#EA504C] uppercase">Eindrücke</div>
                    <h2 className="mt-2 text-4xl font-black text-[#F3F4F6] sm:text-5xl md:text-6xl">Galerie</h2>
                    <Gallery />
                </div>
            </section>
        </div>
    );
};

export default HomePage;
