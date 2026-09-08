import { ApplicationStatus } from '@prisma/client';
import type { ReactElement } from 'react';

interface Props {
    participantId: number;
    status: ApplicationStatus;
}

const actionClassName = 'rounded border border-black px-3 py-1 text-sm no-underline hover:bg-black hover:text-white';

const ContributionSharepicLink = ({ participantId, status }: Props): ReactElement | null => {
    if (status !== ApplicationStatus.Confirmed && status !== ApplicationStatus.Canceled) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            <a className={actionClassName} href={`/programm/${participantId}`} target="_blank">
                Programm öffnen
            </a>
            <a className={actionClassName} href={`/programm/${participantId}/sharepic`} target="_blank">
                Sharepic öffnen
            </a>
        </div>
    );
};

export default ContributionSharepicLink;
