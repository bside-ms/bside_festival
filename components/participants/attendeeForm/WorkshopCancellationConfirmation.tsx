'use client';

import { cancelWorkshopAttendee } from '@/lib/actions/workshopAttendeeActions';
import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';

interface Props {
    token: string;
}

const WorkshopCancellationConfirmation = ({ token }: Props): ReactElement => {
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const cancel = useCallback(async () => {
        setIsSubmitting(true);
        try {
            const cancellation = await cancelWorkshopAttendee(token);
            setResult(
                cancellation.success
                    ? { success: true, message: 'Deine Teilnahme wurde abgemeldet. Der Platz ist wieder frei.' }
                    : { success: false, message: cancellation.message },
            );
        } catch {
            setResult({ success: false, message: 'Die Teilnahme konnte nicht abgemeldet werden. Bitte versuch es noch einmal.' });
        } finally {
            setIsSubmitting(false);
        }
    }, [token]);

    if (result !== null) {
        return <p className={result.success ? 'font-medium' : 'text-red-600'}>{result.message}</p>;
    }

    return (
        <button
            type="button"
            disabled={isSubmitting}
            onClick={cancel}
            className="bg-[#2C2E83] px-5 py-3 font-display font-black text-white disabled:bg-[#2C2E83]/60"
        >
            Teilnahme verbindlich abmelden
        </button>
    );
};

export default WorkshopCancellationConfirmation;
