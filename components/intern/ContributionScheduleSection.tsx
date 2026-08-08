'use client';

/* eslint-disable react/jsx-no-bind */

import ApplicationDetailsFormControls from '@/components/applications/applicationDetails/ApplicationDetailsFormControls';
import ApplicationDetailsTitle from '@/components/applications/applicationDetails/ApplicationDetailsTitle';
import { createScheduleEntry, deleteScheduleEntry, updateScheduleEntry } from '@/lib/actions/scheduleEntryActions';
import formatDate from '@/lib/common/helper/formatDate';
import { festivalAllDayDates, festivalDayViews, scheduleStepMinutes } from '@/lib/schedule/festivalWindow';
import type { SerializableProgramLocation } from '@/typings/SerializableProgramLocation';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import { ScheduleEntryKind, ScheduleEntryTimeMode } from '@prisma/client';
import { addMinutes } from 'date-fns';
import { sortBy } from 'lodash';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useState, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface Props {
    participantId: number;
    programLocations: Array<SerializableProgramLocation>;
    scheduleEntries: Array<SerializableScheduleEntry>;
}

interface ScheduleFormValues {
    programLocationId: string;
    timeMode: ScheduleEntryTimeMode;
    startsAt: string;
    endsAt: string;
    isBlocking: boolean;
    maxAttendees: string;
}

type EditorState = { mode: 'create' } | { mode: 'edit'; entry: SerializableScheduleEntry } | null;

const toDateTimeLocalValue = (date: Date): string => formatDate(date, "yyyy-MM-dd'T'HH:mm");

const parseNullableNumber = (value: string): number | null => {
    if (value.trim().length === 0) {
        return null;
    }

    return Number(value);
};

const formatEntrySummary = (entry: SerializableScheduleEntry, locations: Array<SerializableProgramLocation>): string => {
    const location = locations.find(({ id }) => id === entry.programLocationId);
    const locationLabel =
        location === undefined
            ? `Ort #${entry.programLocationId}`
            : location.areaName === null
              ? location.name
              : `${location.areaName}: ${location.name}`;

    if (entry.timeMode === ScheduleEntryTimeMode.AllDay) {
        return `${locationLabel} · Ganztägig (${entry.allDayDates.join(', ')})`;
    }

    if (entry.startsAt === null || entry.endsAt === null) {
        return locationLabel;
    }

    return `${locationLabel} · ${formatDate(new Date(entry.startsAt), 'EEE dd.MM. HH:mm')} – ${formatDate(new Date(entry.endsAt), 'HH:mm')}`;
};

const defaultCreateStartsAt = (): Date => festivalDayViews[0]!.startsAt;

const ContributionScheduleForm = ({
    entry,
    onClose,
    participantId,
    programLocations,
}: {
    entry: SerializableScheduleEntry | null;
    onClose: () => void;
    participantId: number;
    programLocations: Array<SerializableProgramLocation>;
}): ReactElement => {
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const activeLocations = programLocations.filter(({ isActive }) => isActive);
    const currentLocation = entry === null ? undefined : programLocations.find(({ id }) => id === entry.programLocationId);
    const locationOptions =
        currentLocation !== undefined && !currentLocation.isActive
            ? [...activeLocations, currentLocation]
            : activeLocations.length > 0
              ? activeLocations
              : programLocations;
    const defaultStartsAt = entry?.startsAt === null || entry?.startsAt === undefined ? defaultCreateStartsAt() : new Date(entry.startsAt);
    const defaultEndsAt =
        entry?.endsAt === null || entry?.endsAt === undefined
            ? addMinutes(defaultStartsAt, scheduleStepMinutes * 4)
            : new Date(entry.endsAt);
    const [allDayDates, setAllDayDates] = useState<Array<string>>(entry?.allDayDates ?? [formatDate(defaultStartsAt, 'yyyy-MM-dd')]);
    const methods = useForm<ScheduleFormValues>({
        defaultValues: {
            programLocationId: (entry?.programLocationId ?? locationOptions[0]?.id ?? '').toString(),
            timeMode: entry?.timeMode ?? ScheduleEntryTimeMode.Timed,
            startsAt: toDateTimeLocalValue(defaultStartsAt),
            endsAt: toDateTimeLocalValue(defaultEndsAt),
            isBlocking: entry?.isBlocking ?? true,
            maxAttendees: entry?.maxAttendees?.toString() ?? '',
        },
    });
    const { handleSubmit, register, watch } = methods;
    const timeMode = watch('timeMode');

    const handleAllDayDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = event.target;
        setAllDayDates((dates) => (checked ? sortBy([...dates, value]) : dates.filter((date) => date !== value)));
    }, []);

    const handleFormSubmit = useCallback(
        (values: ScheduleFormValues) => {
            setErrorMessage(null);
            startTransition(async () => {
                try {
                    const input = {
                        kind: ScheduleEntryKind.Participant,
                        timeMode: values.timeMode,
                        programLocationId: Number(values.programLocationId),
                        participantId,
                        title: null,
                        startsAt: values.startsAt,
                        endsAt: values.endsAt,
                        allDayDates,
                        isBlocking: values.isBlocking,
                        isPublic: false,
                        maxAttendees: parseNullableNumber(values.maxAttendees),
                    };

                    if (entry === null) {
                        await createScheduleEntry(input);
                    } else {
                        await updateScheduleEntry(entry.id, input);
                    }

                    onClose();
                } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Der Slot konnte nicht gespeichert werden.');
                }
            });
        },
        [allDayDates, entry, onClose, participantId],
    );

    const handleDeleteClick = useCallback(() => {
        if (entry === null || !window.confirm('Diesen Slot wirklich löschen?')) {
            return;
        }

        setErrorMessage(null);
        startTransition(async () => {
            try {
                await deleteScheduleEntry(entry.id);
                onClose();
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Der Slot konnte nicht gelöscht werden.');
            }
        });
    }, [entry, onClose]);

    return (
        <FormProvider {...methods}>
            <form className="space-y-3" onSubmit={handleSubmit(handleFormSubmit)} noValidate={true}>
                <label className="block">
                    <span className="text-sm font-bold">Programmort</span>
                    <select className="mt-1 w-full rounded border border-black p-2 text-sm" {...register('programLocationId')}>
                        {locationOptions.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.areaName === null ? location.name : `${location.areaName}: ${location.name}`}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="block">
                    <span className="text-sm font-bold">Zeitmodus</span>
                    <select className="mt-1 w-full rounded border border-black p-2 text-sm" {...register('timeMode')}>
                        <option value={ScheduleEntryTimeMode.Timed}>Uhrzeit</option>
                        <option value={ScheduleEntryTimeMode.AllDay}>Ganztägig</option>
                    </select>
                </label>

                {timeMode === ScheduleEntryTimeMode.Timed ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-bold">Start</span>
                            <input
                                type="datetime-local"
                                className="mt-1 w-full rounded border border-black p-2 text-sm"
                                {...register('startsAt')}
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold">Ende</span>
                            <input
                                type="datetime-local"
                                className="mt-1 w-full rounded border border-black p-2 text-sm"
                                {...register('endsAt')}
                            />
                        </label>
                    </div>
                ) : (
                    <div>
                        <div className="text-sm font-bold">Tage</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                            {festivalAllDayDates().map((date) => (
                                <label
                                    key={date}
                                    className="inline-flex items-center gap-2 rounded border border-black/20 bg-white px-2 py-1 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        value={date}
                                        checked={allDayDates.includes(date)}
                                        onChange={handleAllDayDateChange}
                                    />
                                    <span>{formatDate(new Date(`${date}T12:00:00+02:00`), 'EEE dd.MM.')}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <label className="inline-flex items-center gap-2">
                    <input type="checkbox" {...register('isBlocking')} />
                    <span className="text-sm font-bold">Blockiert den Programmort</span>
                </label>

                {timeMode === ScheduleEntryTimeMode.Timed && (
                    <label className="block">
                        <span className="text-sm font-bold">Maximale Anmeldungen</span>
                        <input
                            type="number"
                            min="1"
                            className="mt-1 w-full rounded border border-black p-2 text-sm"
                            {...register('maxAttendees')}
                        />
                    </label>
                )}

                {errorMessage !== null && <div className="text-sm font-bold text-red-700">{errorMessage}</div>}

                <div className="flex flex-wrap items-start gap-3">
                    <ApplicationDetailsFormControls errorMessage={undefined} isSubmitting={isPending} onCancel={onClose} />
                    {entry !== null && (
                        <button
                            type="button"
                            disabled={isPending}
                            className="cursor-pointer rounded border border-red-800 px-3 py-1 text-sm font-bold text-red-800 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={handleDeleteClick}
                        >
                            Löschen
                        </button>
                    )}
                </div>
            </form>
        </FormProvider>
    );
};

const ContributionScheduleSection = ({ participantId, programLocations, scheduleEntries }: Props): ReactElement => {
    const [editorState, setEditorState] = useState<EditorState>(null);

    const closeEditor = useCallback(() => setEditorState(null), []);

    if (editorState !== null) {
        return (
            <div className="space-y-2">
                <div className="font-display text-xl">{editorState.mode === 'create' ? 'Slot anlegen' : 'Slot bearbeiten'}</div>
                <ContributionScheduleForm
                    key={editorState.mode === 'create' ? 'create' : editorState.entry.id}
                    entry={editorState.mode === 'create' ? null : editorState.entry}
                    onClose={closeEditor}
                    participantId={participantId}
                    programLocations={programLocations}
                />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <ApplicationDetailsTitle>Programm-Slot</ApplicationDetailsTitle>

            {scheduleEntries.length === 0 ? (
                <div className="space-y-2">
                    <div className="text-sm text-black/60">Noch kein Slot geplant.</div>
                    <button
                        type="button"
                        className="cursor-pointer rounded border border-black bg-white px-3 py-1 text-sm font-bold hover:bg-gray-100"
                        onClick={() => setEditorState({ mode: 'create' })}
                    >
                        Slot anlegen
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {scheduleEntries.map((entry) => (
                        <div key={entry.id} className="rounded border border-black/20 bg-white p-2">
                            <div className="text-sm font-bold">{formatEntrySummary(entry, programLocations)}</div>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-black/60">
                                {!entry.isBlocking && <span>nicht blockierend</span>}
                                {entry.maxAttendees !== null && <span>max. {entry.maxAttendees} Anmeldungen</span>}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                <button
                                    type="button"
                                    className="cursor-pointer rounded border border-black bg-white px-2 py-0.5 text-xs font-bold hover:bg-gray-100"
                                    onClick={() => setEditorState({ mode: 'edit', entry })}
                                >
                                    Bearbeiten
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="cursor-pointer rounded border border-black bg-white px-3 py-1 text-sm font-bold hover:bg-gray-100"
                        onClick={() => setEditorState({ mode: 'create' })}
                    >
                        Weiteren Slot anlegen
                    </button>
                </div>
            )}
        </div>
    );
};

export default ContributionScheduleSection;
