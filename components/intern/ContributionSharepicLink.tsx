'use client';

import { ApplicationStatus } from '@prisma/client';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';

interface Props {
    participantId: number;
    status: ApplicationStatus;
}

const actionClassName = 'rounded border border-black px-3 py-1 text-sm no-underline hover:bg-black hover:text-white';

const ContributionSharepicLink = ({ participantId, status }: Props): ReactElement | null => {
    const [copied, setCopied] = useState(false);

    const copyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/programm/${participantId}/sharepic`);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }, [participantId]);

    if (status !== ApplicationStatus.Confirmed && status !== ApplicationStatus.Canceled) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            <a className={actionClassName} href={`/programm/${participantId}/sharepic`} target="_blank">
                Sharepic öffnen
            </a>
            <button className={actionClassName} onClick={copyLink} type="button">
                {copied ? 'Sharepic-Link kopiert' : 'Sharepic-Link kopieren'}
            </button>
        </div>
    );
};

export default ContributionSharepicLink;
