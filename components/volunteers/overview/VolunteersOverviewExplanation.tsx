import Link from 'next/link';
import type { ReactElement } from 'react';
import volunteerPreferences from 'lib/volunteers/volunteerPreferences';

const PortalLink = ({ children }: { children: string }): ReactElement => (
    <Link href="https://portal.b-side.ms/group/284ef230-f3f0-4368-a895-334ed02ff59a">
        <a target="_blank" className="underline">
            {children}
        </a>
    </Link>
);

const getExplanation = (key: string): string => volunteerPreferences.find(preference => preference.key === key)!.label;

const VolunteersOverviewExplanation = (): ReactElement => {

    return (
        <div className="px-4 py-5 space-y-5">
            <div>
                <span className="font-bold text-red-700">*</span> Nur einsehbar für Mitglieder der Festival-Datenschutz-Gruppe
                (siehe <PortalLink>hier</PortalLink>). Melde dich gern, wenn du hinzugefügt werden möchtest!
            </div>

            <div className="flex flex-col items-start">
                <div className="px-3 py-2 bg-white">
                    {volunteerPreferences.map(({ emoji, key }) => (
                        <div className="flex gap-4 leading-8" key={key}>
                            <div>{emoji}</div><div>{getExplanation(key)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VolunteersOverviewExplanation;
