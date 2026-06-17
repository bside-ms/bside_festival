'use client';

import { addComment } from '@/lib/actions/applicationActions';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useState, useTransition } from 'react';

interface Props {
    participantId: number;
}

const AddCommentForm = ({ participantId }: Props): ReactElement => {
    const [text, setText] = useState('');
    const [isPending, startTransition] = useTransition();
    const handleTextChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => setText(event.target.value), []);
    const handleSubmit = useCallback(() => {
        const trimmedText = text.trim();

        if (trimmedText.length === 0) {
            return;
        }

        setText('');
        startTransition(async () => {
            await addComment(participantId, trimmedText);
        });
    }, [participantId, text]);

    return (
        <div className="space-y-2">
            <div className="font-display text-xl">Kommentar</div>
            <textarea
                value={text}
                className="min-h-24 w-full rounded border border-black p-2 text-sm outline-0"
                placeholder="Notiz hinzufügen"
                onChange={handleTextChange}
            />
            <button
                type="button"
                disabled={isPending || text.trim().length === 0}
                className="cursor-pointer rounded border border-black bg-black px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSubmit}
            >
                Posten
            </button>
        </div>
    );
};

export default AddCommentForm;
