'use client';

import { removeWorkshopAttendee } from '@/lib/actions/workshopAttendeeActions';
import { compact, map, uniq } from 'lodash';
import Link from 'next/link';
import type { MouseEvent, ReactElement } from 'react';
import { useCallback, useMemo, useState } from 'react';

export interface WorkshopAttendeeListEntry {
    confirmedAt: string | null;
    fullName: string;
    id: number;
    mailAddress?: string;
    message?: string | null;
}

interface Props {
    allowRemoval?: boolean;
    attendees: Array<WorkshopAttendeeListEntry>;
    isInDataPrivacyGroup: boolean;
    participantId?: number;
    scheduleEntryId: number;
    showMessages?: boolean;
}

const actionClassName = 'rounded border border-current px-3 py-1 text-sm font-bold no-underline hover:bg-[#2C2E83] hover:text-white';

const WorkshopAttendeeList = ({
    allowRemoval = false,
    attendees,
    isInDataPrivacyGroup,
    participantId,
    scheduleEntryId,
    showMessages = false,
}: Props): ReactElement => {
    const [copied, setCopied] = useState(false);
    const [removeError, setRemoveError] = useState<string | null>(null);
    const [removingAttendeeId, setRemovingAttendeeId] = useState<number | null>(null);
    const mailAddresses = useMemo(() => uniq(compact(map(attendees, 'mailAddress'))), [attendees]);
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

    const removeAttendee = useCallback(async (attendeeId: number) => {
        if (!window.confirm('Teilnahme wirklich abmelden? Die Person erhält darüber eine E-Mail.')) {
            return;
        }

        setRemovingAttendeeId(attendeeId);
        setRemoveError(null);
        try {
            await removeWorkshopAttendee(attendeeId);
        } catch {
            setRemoveError('Die Teilnahme konnte nicht abgemeldet werden. Bitte versuch es noch einmal.');
        } finally {
            setRemovingAttendeeId(null);
        }
    }, []);

    const handleRemoveClick = useCallback(
        ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
            void removeAttendee(Number(currentTarget.value));
        },
        [removeAttendee],
    );

    return (
        <div className="mt-5 border-t border-[#2C2E83]/25 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-display text-xl font-black">Teilnehmende ({attendees.length})</div>
                {participantId !== undefined && (
                    <Link href={`/intern/${participantId}/teilnehmende/${scheduleEntryId}`} target="_blank" className={actionClassName}>
                        Liste drucken
                    </Link>
                )}
            </div>

            {attendees.length === 0 ? (
                <p className="mt-3 font-medium">Bisher gibt es keine bestätigten Teilnahmen.</p>
            ) : (
                <ul className="mt-3 space-y-2">
                    {attendees.map((attendee) => (
                        <li key={attendee.id} className="rounded bg-[#2C2E83]/10 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="font-bold">{attendee.fullName}</div>
                                    {isInDataPrivacyGroup && attendee.mailAddress !== undefined && (
                                        <div className="text-sm">{attendee.mailAddress}</div>
                                    )}
                                    {showMessages &&
                                        attendee.message !== null &&
                                        attendee.message !== undefined &&
                                        attendee.message !== '' && (
                                            <div className="mt-2 text-sm whitespace-pre-line">Nachricht: {attendee.message}</div>
                                        )}
                                    {showMessages && attendee.confirmedAt === null && (
                                        <div className="mt-2 text-sm font-bold">E-Mail-Bestätigung steht noch aus</div>
                                    )}
                                </div>
                                {allowRemoval && (
                                    <button
                                        type="button"
                                        disabled={removingAttendeeId === attendee.id}
                                        className={actionClassName}
                                        onClick={handleRemoveClick}
                                        value={attendee.id}
                                    >
                                        Abmelden
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {removeError !== null && <div className="mt-3 text-red-600">{removeError}</div>}

            <div className="mt-3 rounded bg-[#2C2E83]/10 p-3 text-sm">
                {isInDataPrivacyGroup
                    ? 'E-Mail-Adressen sind nur für Mitglieder der Datenschutz-Gruppe sichtbar.'
                    : 'Du bist nicht in der Datenschutz-Gruppe; E-Mail-Adressen und die Kontaktaktionen sind deshalb ausgeblendet.'}
            </div>
            {isInDataPrivacyGroup && mailAddresses.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {mailtoFits && (
                        <a href={mailtoHref} className={actionClassName}>
                            E-Mail an alle schreiben
                        </a>
                    )}
                    <button type="button" className={actionClassName} onClick={copyMailAddresses}>
                        {copied ? 'E-Mail-Adressen kopiert' : 'Alle E-Mail-Adressen kopieren'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default WorkshopAttendeeList;
