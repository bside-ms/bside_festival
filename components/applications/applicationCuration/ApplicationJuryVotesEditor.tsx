'use client';

import { updateApplicationJuryVotes } from '@/lib/actions/applicationActions';
import { calculateAverage, curationJuryWeight, formatCurationScore } from '@/lib/applications/curationScoring';
import cn from '@/lib/common/helper/cn';
import { uniqueId } from 'lodash';
import type { ChangeEvent, FocusEvent, KeyboardEvent, ReactElement, RefObject } from 'react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

interface VoteField {
    id: string;
    value: string;
}

interface Props {
    applicationId: number;
    bonusScore: number;
    juryVotes: Array<number> | null;
}

const createVoteFields = (juryVotes: Array<number> | null): Array<VoteField> => [
    ...(juryVotes ?? []).map((vote) => ({ id: uniqueId('jury-vote-'), value: vote.toString() })),
    { id: uniqueId('jury-vote-'), value: '' },
];

const getParsedVotes = (fields: Array<VoteField>): Array<number> => {
    return fields
        .map(({ value }) => value.trim())
        .filter((value) => value !== '')
        .map(Number);
};

const formatLiveScore = (score: number | null): string => {
    if (score === null) {
        return formatCurationScore(score);
    }

    return score.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
};

const ApplicationJuryVoteInput = ({
    field,
    index,
    inputRefs,
    isPending,
    onChange,
    onKeyDown,
}: {
    field: VoteField;
    index: number;
    inputRefs: RefObject<Record<string, HTMLInputElement | null>>;
    isPending: boolean;
    onChange: (fieldId: string, event: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (fieldId: string, event: KeyboardEvent<HTMLInputElement>) => void;
}): ReactElement => {
    const handleRef = useCallback(
        (input: HTMLInputElement | null) => {
            inputRefs.current[field.id] = input;
        },
        [field.id, inputRefs],
    );
    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => onChange(field.id, event), [field.id, onChange]);
    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => onKeyDown(field.id, event), [field.id, onKeyDown]);
    const handleFocus = useCallback((event: FocusEvent<HTMLInputElement>) => event.target.select(), []);

    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{index + 1}</span>
            <input
                ref={handleRef}
                aria-label={`Jury Vote ${index + 1}`}
                inputMode="numeric"
                pattern="[0-5]"
                value={field.value}
                disabled={isPending}
                className={cn(
                    'h-11 w-11 rounded border border-black bg-white text-center font-display text-xl outline-0',
                    field.value === '' && 'border-dashed text-gray-400',
                )}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
            />
        </label>
    );
};

const ApplicationJuryVotesEditor = ({ applicationId, bonusScore, juryVotes }: Props): ReactElement => {
    const [fields, setFields] = useState<Array<VoteField>>(() => createVoteFields(juryVotes));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const parsedVotes = getParsedVotes(fields);
    const liveJuryScore = calculateAverage(parsedVotes);
    const liveFinalScore = liveJuryScore === null ? null : liveJuryScore * curationJuryWeight + bonusScore;

    useEffect(() => {
        setFields(createVoteFields(juryVotes));
        setErrorMessage(null);
    }, [applicationId, juryVotes]);

    const focusField = useCallback((field: VoteField | undefined) => {
        if (field === undefined) {
            return;
        }

        window.requestAnimationFrame(() => inputRefs.current[field.id]?.focus());
    }, []);

    const handleVoteChange = useCallback(
        (fieldId: string, event: ChangeEvent<HTMLInputElement>) => {
            const rawValue = event.target.value.trim();

            if (rawValue === '') {
                setFields((currentFields) => currentFields.map((field) => (field.id === fieldId ? { ...field, value: '' } : field)));
                return;
            }

            if (!/^[0-5]$/.test(rawValue)) {
                return;
            }

            setErrorMessage(null);
            setFields((currentFields) => {
                const fieldIndex = currentFields.findIndex((field) => field.id === fieldId);
                const nextFields = currentFields.map((field) => (field.id === fieldId ? { ...field, value: rawValue } : field));

                if (fieldIndex === nextFields.length - 1) {
                    nextFields.push({ id: uniqueId('jury-vote-'), value: '' });
                }

                focusField(nextFields[fieldIndex + 1]);
                return nextFields;
            });
        },
        [focusField],
    );

    const handleKeyDown = useCallback(
        (fieldId: string, event: KeyboardEvent<HTMLInputElement>) => {
            const fieldIndex = fields.findIndex((field) => field.id === fieldId);

            if (event.key === 'Backspace' && fields[fieldIndex]?.value === '') {
                focusField(fields[fieldIndex - 1]);
            }
        },
        [fields, focusField],
    );

    const handleSubmit = useCallback(() => {
        const votesToSave = getParsedVotes(fields);

        if (votesToSave.some((vote) => !Number.isInteger(vote) || vote < 0 || vote > 5)) {
            setErrorMessage('Bitte nur ganze Zahlen von 0 bis 5 eintragen.');
            return;
        }

        startTransition(async () => {
            try {
                await updateApplicationJuryVotes(applicationId, { juryVotes: votesToSave });
            } catch {
                setErrorMessage('Fehler beim Speichern der Jury Votes.');
            }
        });
    }, [applicationId, fields]);

    const handleFormKeyDown = useCallback(
        (event: KeyboardEvent<HTMLFormElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
            }
        },
        [handleSubmit],
    );
    return (
        <form className="space-y-3" onKeyDown={handleFormKeyDown}>
            <div className="text-sm">
                <span className="text-gray-500">Bonus: </span>
                <span className="font-bold tabular-nums">{formatLiveScore(bonusScore)}</span>
            </div>

            <div>
                <div className="text-sm font-bold">Jury Votes</div>
                <div className="mb-2 text-xs text-gray-600">0 bis 5, Enter speichert</div>
                <div className="flex flex-wrap gap-2">
                    {fields.map((field, index) => (
                        <ApplicationJuryVoteInput
                            key={field.id}
                            field={field}
                            index={index}
                            inputRefs={inputRefs}
                            isPending={isPending}
                            onChange={handleVoteChange}
                            onKeyDown={handleKeyDown}
                        />
                    ))}

                    <button
                        type="button"
                        disabled={isPending}
                        className="mt-5 flex h-11 w-11 items-center justify-center rounded bg-black font-display text-xl text-white disabled:bg-gray-500"
                        onClick={handleSubmit}
                    >
                        ✓
                    </button>
                </div>

                <div className="mt-2 text-sm">
                    <span className="text-gray-500">Jury: </span>
                    <span className="font-bold tabular-nums">{formatLiveScore(liveJuryScore)}</span>
                </div>
            </div>

            <div>
                <span className="mr-2 text-sm text-gray-500">Final:</span>
                <span className="font-display text-3xl font-bold tabular-nums">{formatLiveScore(liveFinalScore)}</span>
            </div>

            {errorMessage !== null && <div className="text-sm text-rose-600">{errorMessage}</div>}
        </form>
    );
};

export default ApplicationJuryVotesEditor;
