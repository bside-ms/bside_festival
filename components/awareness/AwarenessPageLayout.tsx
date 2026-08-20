import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';

type AwarenessToggle = {
    href: string;
    label: string;
    current?: boolean;
};

interface Props {
    children: ReactNode;
    eyebrow: string;
    lang?: string;
    title: string;
    toggles: AwarenessToggle[];
}

const toggleClassName = 'rounded-full bg-[#1d2a6b] px-5 py-2 text-sm font-bold text-white no-underline hover:bg-black';

const AwarenessPageLayout = ({ children, eyebrow, lang, title, toggles }: Props): ReactElement => {
    return (
        <div className="relative mx-auto w-full max-w-4xl px-6 pt-8 pb-16 md:px-10 md:pt-12 md:pb-24" lang={lang}>
            <div className="text-xs font-bold tracking-[0.2em] text-white uppercase">{eyebrow}</div>
            <h1 className="mt-3 font-display text-3xl font-black text-[#1d2a6b] sm:text-4xl md:text-5xl">{title}</h1>
            <div className="mt-6 flex flex-wrap gap-3">
                {toggles.map((toggle) =>
                    toggle.current === true ? (
                        <span key={toggle.label} aria-current="page" className={toggleClassName}>
                            {toggle.label}
                        </span>
                    ) : (
                        <Link key={toggle.href} href={toggle.href} className={toggleClassName}>
                            {toggle.label}
                        </Link>
                    ),
                )}
            </div>
            <div className="mt-10 space-y-8 text-sm leading-relaxed text-black md:text-base">{children}</div>
        </div>
    );
};

export default AwarenessPageLayout;
