'use client';

import VolunteerDetails from '@/components/volunteers/volunteersOverview/VolunteerDetails';
import type { Volunteer } from '@prisma/client';
import { compact, map, uniq } from 'lodash';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';

interface Props {
    volunteers: Array<Volunteer>;
    isInDataPrivacyGroup: boolean;
}

const actionClassName = 'rounded border border-black px-3 py-1 text-sm no-underline hover:bg-black hover:text-white';

const VolunteersOverview = ({ volunteers, isInDataPrivacyGroup }: Props): ReactElement => {
    const [copied, setCopied] = useState(false);

    const mailAddresses = useMemo(() => uniq(compact(map(volunteers, 'mailAddress'))), [volunteers]);
    const mailtoHref = useMemo(() => `mailto:?bcc=${map(mailAddresses, encodeURIComponent).join(',')}`, [mailAddresses]);
    const mailtoFits = mailtoHref.length < 1800;

    const copyMailAddresses = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(mailAddresses.join(', '));
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }, [mailAddresses]);

    const portalLink = (
        <Link
            href="https://portal.b-side.ms/group/284ef230-f3f0-4368-a895-334ed02ff59a"
            className="cursor-pointer underline"
            target="_blank"
        >
            Datenschutz-Gruppe
        </Link>
    );

    return (
        <>
            <div className="mb-3 text-center font-display text-4xl uppercase">Helfer:innen ({volunteers.length})</div>

            {volunteers.length === 0 ? (
                <div className="mt-3 rounded-md bg-white p-2 drop-shadow-sm">Bisher sind keine Helfer:innen-Anmeldungen eingegangen</div>
            ) : (
                <>
                    <div className="mb-3 rounded-md bg-white p-2 drop-shadow-sm">
                        Die Kontakt-Daten der Helfer:innen sind nur für Mitglieder der {portalLink} des Festivals sichtbar.
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {volunteers.map((volunteer) => (
                            <VolunteerDetails key={volunteer.int} volunteer={volunteer} showSensitiveData={isInDataPrivacyGroup} />
                        ))}
                    </div>

                    {isInDataPrivacyGroup && mailAddresses.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 rounded-md bg-white p-2 drop-shadow-sm">
                            {mailtoFits && (
                                <a href={mailtoHref} className={actionClassName}>
                                    E-Mail an alle Helfis schreiben
                                </a>
                            )}
                            <button type="button" className={actionClassName} onClick={copyMailAddresses}>
                                {copied ? 'E-Mail-Adressen kopiert' : 'Alle E-Mail-Adressen kopieren'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default VolunteersOverview;
