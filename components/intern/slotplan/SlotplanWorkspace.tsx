'use client';

/* eslint-disable react/jsx-no-bind */

import { createProgramLocation, deleteUnusedProgramLocation, updateProgramLocation } from '@/lib/actions/programLocationActions';
import { createScheduleEntry, deleteScheduleEntry, updateScheduleEntry } from '@/lib/actions/scheduleEntryActions';
import cn from '@/lib/common/helper/cn';
import formatDate from '@/lib/common/helper/formatDate';
import statusLabels from '@/lib/participants/status/statusLabels';
import typeColors from '@/lib/participants/typeColors';
import typeLabels from '@/lib/participants/typeLabels';
import { festivalAllDayDates, festivalDayViews, scheduleStepMinutes } from '@/lib/schedule/festivalWindow';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { SerializableProgramLocation } from '@/typings/SerializableProgramLocation';
import type { SerializableProgramLocationArea } from '@/typings/SerializableProgramLocationArea';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import { autoUpdate, flip, offset, shift, size, useDismiss, useFloating, useInteractions } from '@floating-ui/react';
import { ScheduleEntryKind, ScheduleEntryTimeMode, type Genre, type ParticipantGenre } from '@prisma/client';
import { addMinutes, differenceInMinutes, isAfter, isBefore } from 'date-fns';
import { range, sortBy } from 'lodash';
import type { ChangeEvent, ReactElement } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import Select from 'react-select';

interface Props {
    allGenres: Array<Genre>;
    participantGenres: Array<ParticipantGenre>;
    participants: Array<SerializableParticipant>;
    programLocations: Array<SerializableProgramLocation>;
    programLocationAreas: Array<SerializableProgramLocationArea>;
    scheduleEntries: Array<SerializableScheduleEntry>;
}

interface ScheduleEntryFormValues {
    kind: ScheduleEntryKind;
    timeMode: ScheduleEntryTimeMode;
    programLocationId: string;
    participantId: string;
    title: string;
    startsAt: string;
    endsAt: string;
    isBlocking: boolean;
    isPublic: boolean;
    maxAttendees: string;
}

interface ProgramLocationFormValues {
    name: string;
    programLocationAreaId: string;
    sortOrder: string;
    address: string;
    latitude: string;
    longitude: string;
    awarenessInfo: string;
    isActive: boolean;
}

interface MoveEntryFormValues {
    programLocationId: string;
    startsAt: string;
    endsAt: string;
}

interface DraftEntry {
    entry: SerializableScheduleEntry | null;
    programLocationId: number;
    startsAt: Date;
    anchorRect: DOMRect;
    contextTimeMode: ScheduleEntryTimeMode;
    mode: 'edit' | 'move';
}

interface PanState {
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startScrollLeft: number;
    startScrollTop: number;
    hasMoved: boolean;
}

const panThreshold = 5;

const toDateTimeLocalValue = (date: Date): string => formatDate(date, "yyyy-MM-dd'T'HH:mm");

const parseNullableNumber = (value: string): number | null => {
    if (value.trim().length === 0) {
        return null;
    }

    return Number(value);
};

const getEntryLabel = (entry: SerializableScheduleEntry, participants: Array<SerializableParticipant>): string => {
    if (entry.kind === ScheduleEntryKind.ScheduleNote) {
        return entry.title ?? 'Hinweis';
    }

    return participants.find(({ id }) => id === entry.participantId)?.name ?? `Programmbeitrag #${entry.participantId}`;
};

const getEntryStatusLabel = (entry: SerializableScheduleEntry, participants: Array<SerializableParticipant>): string | null => {
    if (entry.kind === ScheduleEntryKind.ScheduleNote || entry.participantId === null) {
        return null;
    }

    const participant = participants.find(({ id }) => id === entry.participantId);

    return participant === undefined ? null : statusLabels[participant.status];
};

const getEntryColor = (entry: SerializableScheduleEntry, participants: Array<SerializableParticipant>): string => {
    if (entry.kind === ScheduleEntryKind.ScheduleNote || entry.participantId === null) {
        return '#e5e7eb';
    }

    const participant = participants.find(({ id }) => id === entry.participantId);

    return participant === undefined ? '#e5e7eb' : typeColors[participant.type];
};

const isEntryInDayView = (entry: SerializableScheduleEntry, dayView: (typeof festivalDayViews)[number]): boolean => {
    if (entry.timeMode === ScheduleEntryTimeMode.AllDay) {
        return entry.allDayDates.includes(formatDate(dayView.startsAt, 'yyyy-MM-dd'));
    }

    if (entry.startsAt === null || entry.endsAt === null) {
        return false;
    }

    const startsAt = new Date(entry.startsAt);
    const endsAt = new Date(entry.endsAt);

    return isBefore(startsAt, dayView.endsAt) && isAfter(endsAt, dayView.startsAt);
};

const LocationBadge = ({ location }: { location: SerializableProgramLocation }): ReactElement => (
    <span
        className={cn(
            'inline-flex rounded-full border px-2 py-0.5 text-xs font-bold',
            location.isActive ? 'border-black bg-white text-black' : 'border-gray-300 bg-gray-100 text-gray-500',
        )}
    >
        {location.areaName === null ? location.name : `${location.areaName}: ${location.name}`}
    </span>
);

const ScheduleEntryForm = ({
    draftEntry,
    onClose,
    participants,
}: {
    draftEntry: DraftEntry;
    onClose: () => void;
    participants: Array<SerializableParticipant>;
}): ReactElement => {
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [allDayDates, setAllDayDates] = useState<Array<string>>(
        draftEntry.entry?.allDayDates ?? [formatDate(draftEntry.startsAt, 'yyyy-MM-dd')],
    );
    const entry = draftEntry.entry;
    const defaultStartsAt = entry?.startsAt === null || entry?.startsAt === undefined ? draftEntry.startsAt : new Date(entry.startsAt);
    const defaultEndsAt =
        entry?.endsAt === null || entry?.endsAt === undefined
            ? addMinutes(draftEntry.startsAt, scheduleStepMinutes)
            : new Date(entry.endsAt);
    const methods = useForm<ScheduleEntryFormValues>({
        defaultValues: {
            kind: entry?.kind ?? ScheduleEntryKind.Participant,
            timeMode: entry?.timeMode ?? draftEntry.contextTimeMode,
            programLocationId: (entry?.programLocationId ?? draftEntry.programLocationId).toString(),
            participantId: entry?.participantId?.toString() ?? '',
            title: entry?.title ?? '',
            startsAt: toDateTimeLocalValue(defaultStartsAt),
            endsAt: toDateTimeLocalValue(defaultEndsAt),
            isBlocking: entry?.isBlocking ?? true,
            isPublic: entry?.isPublic ?? false,
            maxAttendees: entry?.maxAttendees?.toString() ?? '',
        },
    });
    const { control, handleSubmit, register, watch } = methods;
    const kind = watch('kind');
    const timeMode = watch('timeMode');

    const participantOptions = useMemo(
        () => participants.map((p) => ({ value: p.id.toString(), label: `${p.name} (${typeLabels[p.type]} · ${statusLabels[p.status]})` })),
        [participants],
    );

    const handleAllDayDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = event.target;
        setAllDayDates((dates) => (checked ? sortBy([...dates, value]) : dates.filter((date) => date !== value)));
    }, []);

    const handleFormSubmit = useCallback(
        (values: ScheduleEntryFormValues) => {
            setErrorMessage(null);
            startTransition(async () => {
                try {
                    const input = {
                        kind: values.kind,
                        timeMode: values.timeMode,
                        programLocationId: Number(values.programLocationId),
                        participantId: values.participantId.length === 0 ? null : Number(values.participantId),
                        title: values.title,
                        startsAt: values.startsAt,
                        endsAt: values.endsAt,
                        allDayDates,
                        isBlocking: values.isBlocking,
                        isPublic: values.isPublic,
                        maxAttendees: parseNullableNumber(values.maxAttendees),
                    };

                    if (entry === null) {
                        await createScheduleEntry(input);
                    } else {
                        await updateScheduleEntry(entry.id, input);
                    }

                    onClose();
                } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Der Slotplan-Eintrag konnte nicht gespeichert werden.');
                }
            });
        },
        [allDayDates, entry, onClose],
    );

    const handleDeleteClick = useCallback(() => {
        if (entry === null || !window.confirm('Diesen Slotplan-Eintrag wirklich löschen?')) {
            return;
        }

        setErrorMessage(null);
        startTransition(async () => {
            try {
                await deleteScheduleEntry(entry.id);
                onClose();
            } catch (error) {
                setErrorMessage(error instanceof Error ? error.message : 'Der Slotplan-Eintrag konnte nicht gelöscht werden.');
            }
        });
    }, [entry, onClose]);

    return (
        <div className="rounded-md border border-black bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <div className="font-display text-2xl">{entry === null ? 'Eintrag hinzufügen' : 'Eintrag bearbeiten'}</div>
                    {entry === null && <div className="text-sm text-black/60">Zeiten werden im 15-Minuten-Raster validiert.</div>}
                </div>
                <button
                    type="button"
                    className="cursor-pointer rounded border border-black px-3 py-1 text-sm font-bold hover:bg-black/5"
                    onClick={onClose}
                >
                    Schließen
                </button>
            </div>

            <FormProvider {...methods}>
                <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(handleFormSubmit)}>
                    <input type="hidden" {...register('timeMode')} />
                    <input type="hidden" {...register('programLocationId')} />
                    {entry !== null && (
                        <>
                            <input type="hidden" {...register('startsAt')} />
                            <input type="hidden" {...register('endsAt')} />
                        </>
                    )}

                    <label className="block">
                        <span className="text-sm font-bold">Art</span>
                        <select className="mt-1 w-full rounded border border-black p-2" {...register('kind')}>
                            <option value={ScheduleEntryKind.Participant}>Programmbeitrag</option>
                            <option value={ScheduleEntryKind.ScheduleNote}>Hinweis</option>
                        </select>
                    </label>

                    {kind === ScheduleEntryKind.Participant ? (
                        <div className="block">
                            <span className="text-sm font-bold">Programmbeitrag</span>
                            <Controller
                                name="participantId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        inputId="participantId"
                                        options={participantOptions}
                                        value={participantOptions.find((opt) => opt.value === field.value) ?? null}
                                        onChange={(option) => field.onChange(option?.value ?? '')}
                                        onBlur={field.onBlur}
                                        isClearable
                                        placeholder="Suchen…"
                                        noOptionsMessage={() => 'Kein Ergebnis'}
                                        classNames={{
                                            control: ({ isFocused }) =>
                                                cn(
                                                    'mt-1 rounded border bg-white px-1 py-0.5 text-sm',
                                                    isFocused ? 'border-black ring-2 ring-black/10' : 'border-black',
                                                ),
                                            menu: () => 'mt-1 rounded border border-black bg-white shadow-lg z-50',
                                            menuList: () => 'max-h-60 overflow-y-auto py-1',
                                            option: ({ isFocused, isSelected }) =>
                                                cn(
                                                    'cursor-pointer px-3 py-1.5 text-sm',
                                                    isSelected && 'bg-black text-white',
                                                    !isSelected && isFocused && 'bg-black/10',
                                                ),
                                            placeholder: () => 'text-black/40 text-sm',
                                            singleValue: () => 'text-sm',
                                            clearIndicator: () => 'text-black/40 hover:text-black cursor-pointer',
                                            dropdownIndicator: () => 'text-black/40 hover:text-black cursor-pointer',
                                            indicatorSeparator: () => 'bg-black/20',
                                            input: () => 'text-sm',
                                            noOptionsMessage: () => 'px-3 py-2 text-sm text-black/50',
                                        }}
                                        unstyled
                                    />
                                )}
                            />
                        </div>
                    ) : (
                        <label className="block">
                            <span className="text-sm font-bold">Hinweis</span>
                            <input className="mt-1 w-full rounded border border-black p-2" {...register('title')} />
                        </label>
                    )}

                    {entry === null &&
                        (timeMode === ScheduleEntryTimeMode.Timed ? (
                            <>
                                <label className="block">
                                    <span className="text-sm font-bold">Start</span>
                                    <input
                                        type="datetime-local"
                                        className="mt-1 w-full rounded border border-black p-2"
                                        {...register('startsAt')}
                                    />
                                </label>

                                <label className="block">
                                    <span className="text-sm font-bold">Ende</span>
                                    <input
                                        type="datetime-local"
                                        className="mt-1 w-full rounded border border-black p-2"
                                        {...register('endsAt')}
                                    />
                                </label>
                            </>
                        ) : (
                            <div className="md:col-span-2">
                                <div className="text-sm font-bold">Tage</div>
                                <div className="mt-1 flex flex-wrap gap-3">
                                    {festivalAllDayDates().map((date) => (
                                        <label
                                            key={date}
                                            className="inline-flex items-center gap-2 rounded border border-black/20 bg-white px-2 py-1"
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
                        ))}

                    <label className="inline-flex items-center gap-2">
                        <input type="checkbox" {...register('isBlocking')} />
                        <span className="text-sm font-bold">Blockiert den Programmort</span>
                    </label>

                    {kind === ScheduleEntryKind.ScheduleNote && (
                        <label className="inline-flex items-center gap-2">
                            <input type="checkbox" {...register('isPublic')} />
                            <span className="text-sm font-bold">Öffentlich anzeigen</span>
                        </label>
                    )}

                    {kind === ScheduleEntryKind.Participant && timeMode === ScheduleEntryTimeMode.Timed && (
                        <label className="block">
                            <span className="text-sm font-bold">Maximale Anmeldungen</span>
                            <input
                                type="number"
                                min="1"
                                className="mt-1 w-full rounded border border-black p-2"
                                {...register('maxAttendees')}
                            />
                        </label>
                    )}

                    {errorMessage !== null && <div className="text-sm font-bold text-red-700 md:col-span-2">{errorMessage}</div>}

                    <div className="flex flex-wrap gap-2 md:col-span-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer rounded border border-black bg-black px-4 py-2 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Speichern
                        </button>
                        {entry !== null && (
                            <button
                                type="button"
                                disabled={isPending}
                                className="cursor-pointer rounded border border-red-800 px-4 py-2 font-bold text-red-800 hover:bg-red-800/5 disabled:cursor-not-allowed disabled:opacity-50"
                                onClick={handleDeleteClick}
                            >
                                Löschen
                            </button>
                        )}
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

const MoveEntryForm = ({
    draftEntry,
    onClose,
    programLocations,
}: {
    draftEntry: DraftEntry;
    onClose: () => void;
    programLocations: Array<SerializableProgramLocation>;
}): ReactElement => {
    const entry = draftEntry.entry!;
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [allDayDates, setAllDayDates] = useState<Array<string>>(entry.allDayDates);
    const defaultStartsAt = entry.startsAt === null ? draftEntry.startsAt : new Date(entry.startsAt);
    const defaultEndsAt = entry.endsAt === null ? addMinutes(draftEntry.startsAt, scheduleStepMinutes) : new Date(entry.endsAt);
    const methods = useForm<MoveEntryFormValues>({
        defaultValues: {
            programLocationId: entry.programLocationId.toString(),
            startsAt: toDateTimeLocalValue(defaultStartsAt),
            endsAt: toDateTimeLocalValue(defaultEndsAt),
        },
    });
    const { handleSubmit, register } = methods;

    const handleAllDayDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { checked, value } = event.target;
        setAllDayDates((dates) => (checked ? sortBy([...dates, value]) : dates.filter((date) => date !== value)));
    }, []);

    const handleFormSubmit = useCallback(
        (values: MoveEntryFormValues) => {
            setErrorMessage(null);
            startTransition(async () => {
                try {
                    await updateScheduleEntry(entry.id, {
                        kind: entry.kind,
                        timeMode: entry.timeMode,
                        programLocationId: Number(values.programLocationId),
                        participantId: entry.participantId,
                        title: entry.title,
                        startsAt: values.startsAt,
                        endsAt: values.endsAt,
                        allDayDates,
                        isBlocking: entry.isBlocking,
                        isPublic: entry.isPublic,
                        maxAttendees: entry.maxAttendees,
                    });
                    onClose();
                } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Der Slotplan-Eintrag konnte nicht verschoben werden.');
                }
            });
        },
        [allDayDates, entry, onClose],
    );

    return (
        <div className="rounded-md border border-black bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="font-display text-2xl">Eintrag verschieben</div>
                <button
                    type="button"
                    className="cursor-pointer rounded border border-black px-3 py-1 text-sm font-bold hover:bg-black/5"
                    onClick={onClose}
                >
                    Schließen
                </button>
            </div>

            <FormProvider {...methods}>
                <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(handleFormSubmit)}>
                    <label className="block md:col-span-2">
                        <span className="text-sm font-bold">Programmort</span>
                        <select className="mt-1 w-full rounded border border-black p-2" {...register('programLocationId')}>
                            {programLocations.map((location) => (
                                <option key={location.id} value={location.id}>
                                    {location.areaName === null ? location.name : `${location.areaName}: ${location.name}`}
                                </option>
                            ))}
                        </select>
                    </label>

                    {draftEntry.contextTimeMode === ScheduleEntryTimeMode.Timed ? (
                        <>
                            <label className="block">
                                <span className="text-sm font-bold">Start</span>
                                <input
                                    type="datetime-local"
                                    className="mt-1 w-full rounded border border-black p-2"
                                    {...register('startsAt')}
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold">Ende</span>
                                <input
                                    type="datetime-local"
                                    className="mt-1 w-full rounded border border-black p-2"
                                    {...register('endsAt')}
                                />
                            </label>
                        </>
                    ) : (
                        <div className="md:col-span-2">
                            <div className="text-sm font-bold">Tage</div>
                            <div className="mt-1 flex flex-wrap gap-3">
                                {festivalAllDayDates().map((date) => (
                                    <label
                                        key={date}
                                        className="inline-flex items-center gap-2 rounded border border-black/20 bg-white px-2 py-1"
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

                    {errorMessage !== null && <div className="text-sm font-bold text-red-700 md:col-span-2">{errorMessage}</div>}

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer rounded border border-black bg-black px-4 py-2 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Speichern
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

const ScheduleEntryPopover = ({
    draftEntry,
    onClose,
    onOutsidePress,
    participants,
    programLocations,
}: {
    draftEntry: DraftEntry;
    onClose: () => void;
    onOutsidePress: (event: Event | undefined) => void;
    participants: Array<SerializableParticipant>;
    programLocations: Array<SerializableProgramLocation>;
}): ReactElement => {
    const isMobile = window.innerWidth < 768;

    const { refs, floatingStyles, context } = useFloating({
        open: true,
        onOpenChange: (open, event, reason) => {
            if (!open) {
                if (reason === 'outside-press') {
                    onOutsidePress(event);
                } else {
                    onClose();
                }
            }
        },
        middleware: [
            offset(8),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
            size({
                apply({ availableHeight, elements }) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${Math.min(availableHeight - 8, 600)}px`,
                    });
                },
                padding: 8,
            }),
        ],
        whileElementsMounted: autoUpdate,
    });

    useEffect(() => {
        refs.setReference({
            getBoundingClientRect: () => draftEntry.anchorRect,
        });
    }, [refs, draftEntry.anchorRect]);

    useEffect(() => {
        if (!isMobile) {
            return;
        }

        const scrollY = window.scrollY;
        const previousBodyStyles = {
            overflow: document.body.style.overflow,
            position: document.body.style.position,
            top: document.body.style.top,
            width: document.body.style.width,
        };
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyStyles.overflow;
            document.body.style.position = previousBodyStyles.position;
            document.body.style.top = previousBodyStyles.top;
            document.body.style.width = previousBodyStyles.width;
            window.scrollTo(0, scrollY);
        };
    }, [isMobile]);

    const dismiss = useDismiss(context, { outsidePress: !isMobile });
    const { getFloatingProps } = useInteractions([dismiss]);

    const formContent =
        draftEntry.mode === 'move' ? (
            <MoveEntryForm draftEntry={draftEntry} programLocations={programLocations} onClose={onClose} />
        ) : (
            <ScheduleEntryForm draftEntry={draftEntry} participants={participants} onClose={onClose} />
        );

    if (isMobile) {
        return createPortal(
            <>
                <div
                    className="fixed inset-0 z-[100] bg-black/40"
                    onClick={(event) => {
                        event.stopPropagation();
                        onClose();
                    }}
                />
                <div
                    ref={refs.setFloating}
                    className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-[110] flex max-h-[calc(100dvh-1rem-env(safe-area-inset-bottom))] flex-col overflow-hidden rounded-2xl border border-black bg-white shadow-xl"
                    {...getFloatingProps()}
                >
                    <div className="min-h-0 overflow-y-auto [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none">{formContent}</div>
                </div>
            </>,
            document.body,
        );
    }

    return createPortal(
        <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, width: '480px', zIndex: 100 }}
            className="overflow-y-auto"
            {...getFloatingProps()}
        >
            {formContent}
        </div>,
        document.body,
    );
};

const ProgramLocationForm = ({
    location,
    programLocationAreas,
    onClose,
}: {
    location: SerializableProgramLocation | null;
    programLocationAreas: Array<SerializableProgramLocationArea>;
    onClose: () => void;
}): ReactElement => {
    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const methods = useForm<ProgramLocationFormValues>({
        defaultValues: {
            name: location?.name ?? '',
            programLocationAreaId: location?.programLocationAreaId?.toString() ?? '',
            sortOrder: location?.sortOrder.toString() ?? '0',
            address: location?.address ?? '',
            latitude: location?.latitude?.toString() ?? '',
            longitude: location?.longitude?.toString() ?? '',
            awarenessInfo: location?.awarenessInfo ?? '',
            isActive: location?.isActive ?? true,
        },
    });
    const { handleSubmit, register } = methods;

    const handleFormSubmit = useCallback(
        (values: ProgramLocationFormValues) => {
            setErrorMessage(null);
            startTransition(async () => {
                try {
                    const input = {
                        name: values.name,
                        programLocationAreaId: values.programLocationAreaId.length > 0 ? Number(values.programLocationAreaId) : null,
                        sortOrder: Number(values.sortOrder),
                        address: values.address,
                        latitude: parseNullableNumber(values.latitude),
                        longitude: parseNullableNumber(values.longitude),
                        awarenessInfo: values.awarenessInfo,
                        isActive: values.isActive,
                    };

                    if (location === null) {
                        await createProgramLocation(input);
                    } else {
                        await updateProgramLocation(location.id, input);
                    }

                    onClose();
                } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : 'Der Programmort konnte nicht gespeichert werden.');
                }
            });
        },
        [location, onClose],
    );

    return (
        <div className="rounded-md border border-black bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="font-display text-2xl">{location === null ? 'Programmort hinzufügen' : 'Programmort bearbeiten'}</div>
                <button
                    type="button"
                    className="cursor-pointer rounded border border-black px-3 py-1 text-sm font-bold hover:bg-black/5"
                    onClick={onClose}
                >
                    Schließen
                </button>
            </div>

            <FormProvider {...methods}>
                <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(handleFormSubmit)}>
                    <label className="block">
                        <span className="text-sm font-bold">
                            Name <span className="text-red-600">*</span>
                        </span>
                        <input className="mt-1 w-full rounded border border-black p-2" {...register('name')} />
                    </label>
                    <label className="block">
                        <span className="text-sm font-bold">Bereich</span>
                        <select className="mt-1 w-full rounded border border-black p-2" {...register('programLocationAreaId')}>
                            <option value="">Kein Bereich</option>
                            {programLocationAreas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-black/50">Gruppiert mehrere Orte unter einem Oberbegriff</p>
                    </label>
                    <label className="block">
                        <span className="text-sm font-bold">Sortierung</span>
                        <input type="number" className="mt-1 w-full rounded border border-black p-2" {...register('sortOrder')} />
                        <p className="mt-1 text-xs text-black/50">Niedrigere Zahlen erscheinen zuerst</p>
                    </label>
                    <label className="block">
                        <span className="text-sm font-bold">Adresse</span>
                        <input className="mt-1 w-full rounded border border-black p-2" {...register('address')} />
                        <p className="mt-1 text-xs text-black/50">Straße und Hausnummer für externe Karten</p>
                    </label>
                    <label className="block">
                        <span className="text-sm font-bold">Breitengrad</span>
                        <input type="number" step="any" className="mt-1 w-full rounded border border-black p-2" {...register('latitude')} />
                        <p className="mt-1 text-xs text-black/50">GPS-Koordinate, z.B. 51.3456</p>
                    </label>
                    <label className="block">
                        <span className="text-sm font-bold">Längengrad</span>
                        <input
                            type="number"
                            step="any"
                            className="mt-1 w-full rounded border border-black p-2"
                            {...register('longitude')}
                        />
                        <p className="mt-1 text-xs text-black/50">GPS-Koordinate, z.B. 12.3456</p>
                    </label>
                    <label className="block md:col-span-2">
                        <span className="text-sm font-bold">Barrierefreiheitsinfo</span>
                        <textarea className="mt-1 w-full rounded border border-black p-2" {...register('awarenessInfo')} />
                        <p className="mt-1 text-xs text-black/50">Wird im öffentlichen Programm angezeigt, z.B. stufenloser Zugang</p>
                    </label>
                    <div className="block">
                        <label className="inline-flex items-center gap-2">
                            <input type="checkbox" {...register('isActive')} />
                            <span className="text-sm font-bold">Aktiv</span>
                        </label>
                        <p className="mt-1 text-xs text-black/50">Inaktive Orte werden im öffentlichen Programm ausgeblendet</p>
                    </div>
                    {errorMessage !== null && <div className="text-sm font-bold text-red-700 md:col-span-2">{errorMessage}</div>}
                    <div className="md:col-span-2">
                        <p className="mb-3 text-xs text-black/50">
                            <span className="text-red-600">*</span> Pflichtfeld
                        </p>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer rounded border border-black bg-black px-4 py-2 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Speichern
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

const SlotplanWorkspace = ({
    allGenres,
    participantGenres,
    participants,
    programLocations,
    programLocationAreas,
    scheduleEntries,
}: Props): ReactElement => {
    const [activeTab, setActiveTab] = useState<'locations' | 'planner'>('planner');
    const [activeAreaFilter, setActiveAreaFilter] = useState<number | 'unassigned' | 'all'>(
        () => programLocationAreas.find(({ name }) => name === 'B-Side')?.id ?? 'all',
    );

    useEffect(() => {
        if (new URL(window.location.href).searchParams.get('tab') === 'locations') {
            setActiveTab('locations');
        }
    }, []);
    const [activeDayLabel, setActiveDayLabel] = useState(festivalDayViews[0]!.label);
    const [draftEntry, setDraftEntry] = useState<DraftEntry | null>(null);
    const [editedLocation, setEditedLocation] = useState<SerializableProgramLocation | null | undefined>(undefined);
    const [expandedEntryId, setExpandedEntryId] = useState<number | null>(null);
    const [isPanning, setIsPanning] = useState(false);
    const [isPending, startTransition] = useTransition();
    const plannerViewportRef = useRef<HTMLDivElement>(null);
    const panStateRef = useRef<PanState | null>(null);
    const suppressNextClickRef = useRef(false);
    const activeDayView = festivalDayViews.find(({ label }) => label === activeDayLabel) ?? festivalDayViews[0]!;
    const activeLocations = programLocations.filter(({ isActive }) => isActive);
    const hasUnassignedLocations = activeLocations.some(({ programLocationAreaId }) => programLocationAreaId === null);
    const visibleLocations = activeLocations.filter(({ programLocationAreaId }) => {
        if (activeAreaFilter === 'all') {
            return true;
        }

        if (activeAreaFilter === 'unassigned') {
            return programLocationAreaId === null;
        }

        return programLocationAreaId === activeAreaFilter;
    });
    const activeEntries = scheduleEntries.filter((entry) => isEntryInDayView(entry, activeDayView));
    const minuteRows = useMemo(
        () => range(0, differenceInMinutes(activeDayView.endsAt, activeDayView.startsAt), scheduleStepMinutes),
        [activeDayView.endsAt, activeDayView.startsAt],
    );
    const rowHeight = 28;

    useEffect(() => {
        if (plannerViewportRef.current !== null) {
            plannerViewportRef.current.scrollLeft = 0;
        }
    }, [activeAreaFilter]);

    const handlePlannerPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (
            event.pointerType !== 'mouse' ||
            event.button !== 0 ||
            (event.target as HTMLElement).closest('[data-slotplan-pan-ignore]') !== null
        ) {
            return;
        }

        const viewport = plannerViewportRef.current;

        if (viewport === null) {
            return;
        }

        panStateRef.current = {
            pointerId: event.pointerId,
            startClientX: event.clientX,
            startClientY: event.clientY,
            startScrollLeft: viewport.scrollLeft,
            startScrollTop: viewport.scrollTop,
            hasMoved: false,
        };
    }, []);

    const handlePlannerPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const viewport = plannerViewportRef.current;
        const panState = panStateRef.current;

        if (viewport === null || panState === null || panState.pointerId !== event.pointerId) {
            return;
        }

        const deltaX = event.clientX - panState.startClientX;
        const deltaY = event.clientY - panState.startClientY;

        if (!panState.hasMoved && Math.hypot(deltaX, deltaY) < panThreshold) {
            return;
        }

        if (!panState.hasMoved) {
            panState.hasMoved = true;
            viewport.setPointerCapture(event.pointerId);
            setIsPanning(true);
        }

        event.preventDefault();
        viewport.scrollLeft = panState.startScrollLeft - deltaX;
        viewport.scrollTop = panState.startScrollTop - deltaY;
    }, []);

    const handlePlannerPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const viewport = plannerViewportRef.current;
        const panState = panStateRef.current;

        if (viewport === null || panState === null || panState.pointerId !== event.pointerId) {
            return;
        }

        if (viewport.hasPointerCapture(event.pointerId)) {
            viewport.releasePointerCapture(event.pointerId);
        }

        if (panState.hasMoved) {
            suppressNextClickRef.current = true;
            window.setTimeout(() => {
                suppressNextClickRef.current = false;
            });
        }

        panStateRef.current = null;
        setIsPanning(false);
    }, []);

    const handlePlannerPointerCancel = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (panStateRef.current?.pointerId !== event.pointerId) {
            return;
        }

        panStateRef.current = null;
        setIsPanning(false);
    }, []);

    const handlePlannerClickCapture = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!suppressNextClickRef.current) {
            return;
        }

        suppressNextClickRef.current = false;
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleCellClick = useCallback(
        (programLocationId: number, startsAt: Date, event: React.MouseEvent, contextTimeMode: ScheduleEntryTimeMode) => {
            setDraftEntry({
                entry: null,
                programLocationId,
                startsAt,
                anchorRect: event.currentTarget.getBoundingClientRect(),
                contextTimeMode,
                mode: 'edit',
            });
        },
        [],
    );

    const handleEntryClick = useCallback(
        (entry: SerializableScheduleEntry, event: React.MouseEvent, mode: 'edit' | 'move') => {
            const startsAt = entry.startsAt === null ? activeDayView.startsAt : new Date(entry.startsAt);
            setDraftEntry({
                entry,
                programLocationId: entry.programLocationId,
                startsAt,
                anchorRect: event.currentTarget.getBoundingClientRect(),
                contextTimeMode: entry.timeMode,
                mode,
            });
        },
        [activeDayView.startsAt],
    );

    const handleDeleteLocationClick = useCallback((location: SerializableProgramLocation) => {
        if (!window.confirm('Programmort löschen? Falls Einträge existieren, wird er stattdessen deaktiviert.')) {
            return;
        }

        startTransition(async () => {
            await deleteUnusedProgramLocation(location.id);
        });
    }, []);

    const handleQuickDeleteEntry = useCallback((entry: SerializableScheduleEntry) => {
        if (!window.confirm('Diesen Slotplan-Eintrag wirklich löschen?')) {
            return;
        }

        startTransition(async () => {
            await deleteScheduleEntry(entry.id);
            setExpandedEntryId(null);
        });
    }, []);

    const getParticipantGenres = useCallback(
        (participantId: number): Array<string> => {
            const genreIds = participantGenres.filter((genre) => genre.participantId === participantId).map((genre) => genre.genreId);

            return allGenres.filter((genre) => genreIds.includes(genre.id)).map(({ name }) => name);
        },
        [allGenres, participantGenres],
    );

    return (
        <div className="space-y-3 md:space-y-5">
            <div className="flex items-center justify-between gap-2 md:items-end">
                <div>
                    <h1 className="font-display text-3xl leading-none uppercase md:text-5xl">Slotplan</h1>
                    <div className="mt-1 hidden text-sm text-black/60 md:block">
                        Kanonische interne Planung für Programmorte und Zeiten.
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        className={cn(
                            'cursor-pointer rounded border border-black px-2 py-1 text-sm font-bold md:px-3 md:py-2 md:text-base',
                            activeTab === 'planner' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white hover:bg-black/5',
                        )}
                        onClick={() => setActiveTab('planner')}
                    >
                        Planer
                    </button>
                    <button
                        type="button"
                        className={cn(
                            'cursor-pointer rounded border border-black px-2 py-1 text-sm font-bold md:px-3 md:py-2 md:text-base',
                            activeTab === 'locations' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white hover:bg-black/5',
                        )}
                        onClick={() => setActiveTab('locations')}
                    >
                        Programmorte
                    </button>
                </div>
            </div>

            {activeTab === 'planner' ? (
                <div className="space-y-2 md:space-y-4">
                    <div className="flex gap-2 overflow-x-auto pb-1 md:block md:space-y-4 md:overflow-visible md:pb-0">
                        <div className="flex shrink-0 gap-2">
                            {festivalDayViews.map((dayView) => (
                                <button
                                    key={dayView.label}
                                    type="button"
                                    className={cn(
                                        'cursor-pointer rounded-full border border-black px-2 py-0.5 text-xs font-bold md:px-3 md:py-1 md:text-sm',
                                        activeDayLabel === dayView.label
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-white text-black hover:bg-black/5',
                                    )}
                                    onClick={() => setActiveDayLabel(dayView.label)}
                                >
                                    {dayView.label} {formatDate(dayView.startsAt, 'dd.MM.')}
                                </button>
                            ))}
                        </div>
                        <div className="flex shrink-0 gap-2 border-l border-black/20 pl-2 md:flex-wrap md:border-l-0 md:pl-0">
                            {programLocationAreas.map((area) => (
                                <button
                                    key={area.id}
                                    type="button"
                                    className={cn(
                                        'cursor-pointer rounded-full border border-black px-2 py-0.5 text-xs font-bold md:px-3 md:py-1 md:text-sm',
                                        activeAreaFilter === area.id
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-white text-black hover:bg-black/5',
                                    )}
                                    onClick={() => setActiveAreaFilter(area.id)}
                                >
                                    {area.name}
                                </button>
                            ))}
                            {hasUnassignedLocations && (
                                <button
                                    type="button"
                                    className={cn(
                                        'cursor-pointer rounded-full border border-black px-2 py-0.5 text-xs font-bold md:px-3 md:py-1 md:text-sm',
                                        activeAreaFilter === 'unassigned'
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-white text-black hover:bg-black/5',
                                    )}
                                    onClick={() => setActiveAreaFilter('unassigned')}
                                >
                                    Ohne Bereich
                                </button>
                            )}
                            <button
                                type="button"
                                className={cn(
                                    'cursor-pointer rounded-full border border-black px-2 py-0.5 text-xs font-bold md:px-3 md:py-1 md:text-sm',
                                    activeAreaFilter === 'all'
                                        ? 'bg-black text-white hover:bg-gray-800'
                                        : 'bg-white text-black hover:bg-black/5',
                                )}
                                onClick={() => setActiveAreaFilter('all')}
                            >
                                Alle Bereiche
                            </button>
                        </div>
                    </div>

                    {draftEntry !== null && (
                        <ScheduleEntryPopover
                            key={`${draftEntry.entry?.id ?? 'new'}-${draftEntry.programLocationId}-${draftEntry.startsAt.toISOString()}-${draftEntry.mode}`}
                            draftEntry={draftEntry}
                            participants={participants}
                            programLocations={programLocations}
                            onClose={() => setDraftEntry(null)}
                            onOutsidePress={(event) => {
                                suppressNextClickRef.current =
                                    event?.target instanceof Node && plannerViewportRef.current?.contains(event.target) === true;
                                setDraftEntry(null);
                            }}
                        />
                    )}

                    {visibleLocations.length === 0 ? (
                        <div className="rounded-md border border-black bg-white p-5 font-bold">
                            Keine aktiven Programmorte in diesem Bereich.
                        </div>
                    ) : (
                        <div
                            ref={plannerViewportRef}
                            className={cn(
                                'h-[max(24rem,calc(100dvh-11rem))] overflow-auto rounded-md border border-black bg-white',
                                isPanning ? 'cursor-grabbing select-none' : 'cursor-grab',
                            )}
                            onClick={() => setExpandedEntryId(null)}
                            onClickCapture={handlePlannerClickCapture}
                            onPointerCancel={handlePlannerPointerCancel}
                            onPointerDown={handlePlannerPointerDown}
                            onPointerMove={handlePlannerPointerMove}
                            onPointerUp={handlePlannerPointerUp}
                        >
                            <div
                                className="grid min-w-max"
                                style={{
                                    gridTemplateColumns: `80px repeat(${visibleLocations.length}, 190px)`,
                                    gridTemplateRows: `64px 56px repeat(${minuteRows.length}, ${rowHeight}px)`,
                                }}
                            >
                                <div className="sticky top-0 left-0 z-50 border-r border-b border-black bg-gray-100 p-2 font-bold">
                                    Zeit
                                </div>
                                {visibleLocations.map((location) => (
                                    <div
                                        key={location.id}
                                        className="sticky top-0 z-40 border-r border-b border-black bg-[#ebc9de] p-2 font-bold"
                                    >
                                        {location.name}
                                        {location.areaName !== null && <div className="text-xs font-normal">{location.areaName}</div>}
                                    </div>
                                ))}
                                <div className="sticky left-0 z-20 row-start-2 border-r border-b border-black bg-gray-50 p-2 text-xs font-bold">
                                    Ganztägig
                                </div>
                                {visibleLocations.map((location, locationIndex) => {
                                    const allDayEntries = activeEntries.filter(
                                        (entry) =>
                                            entry.programLocationId === location.id && entry.timeMode === ScheduleEntryTimeMode.AllDay,
                                    );

                                    return (
                                        <div
                                            key={`all-day-${location.id}`}
                                            className="group/cell cursor-inherit relative row-start-2 space-y-1 overflow-visible border-r border-b border-black/30 bg-gray-50 p-1 hover:bg-yellow-50/60"
                                            style={{ gridColumnStart: locationIndex + 2 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCellClick(location.id, activeDayView.startsAt, e, ScheduleEntryTimeMode.AllDay);
                                            }}
                                        >
                                            <span className="pointer-events-none absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-xs font-bold text-black/40 opacity-0 group-hover/cell:opacity-100">
                                                +
                                            </span>
                                            {allDayEntries.map((entry) => {
                                                const isExpanded = expandedEntryId === entry.id;
                                                const participant =
                                                    entry.participantId === null
                                                        ? undefined
                                                        : participants.find(({ id }) => id === entry.participantId);
                                                const statusLabel = getEntryStatusLabel(entry, participants);

                                                return (
                                                    <div
                                                        key={entry.id}
                                                        className={cn(
                                                            'group cursor-inherit relative w-full rounded border border-black px-2 py-1 text-left text-xs',
                                                            isExpanded && 'z-30',
                                                        )}
                                                        style={{ backgroundColor: getEntryColor(entry, participants) }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedEntryId(isExpanded ? null : entry.id);
                                                        }}
                                                    >
                                                        <span
                                                            className={cn(
                                                                'transition-opacity duration-150',
                                                                isExpanded ? 'opacity-0' : 'group-hover:opacity-0',
                                                            )}
                                                        >
                                                            {getEntryLabel(entry, participants)}
                                                        </span>
                                                        <div
                                                            className={cn(
                                                                'absolute -top-px -right-px -left-px z-50 flex origin-top flex-col gap-1 rounded border border-black p-2 shadow-lg transition-[opacity,transform] duration-150',
                                                                isExpanded
                                                                    ? 'pointer-events-auto scale-105 opacity-100'
                                                                    : 'pointer-events-none scale-100 opacity-0 group-hover:pointer-events-auto group-hover:scale-105 group-hover:opacity-100',
                                                            )}
                                                            style={{ backgroundColor: getEntryColor(entry, participants) }}
                                                        >
                                                            <div className="font-bold">{getEntryLabel(entry, participants)}</div>
                                                            {participant !== undefined && <div>{typeLabels[participant.type]}</div>}
                                                            {statusLabel !== null && (
                                                                <div className="mt-0.5 inline-flex rounded bg-white/80 px-1 font-bold">
                                                                    {statusLabel}
                                                                </div>
                                                            )}
                                                            <div className="flex flex-wrap gap-1">
                                                                <button
                                                                    type="button"
                                                                    data-slotplan-pan-ignore
                                                                    className="cursor-pointer rounded border border-black bg-white px-2 py-0.5 font-bold hover:bg-gray-100"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedEntryId(null);
                                                                        handleEntryClick(entry, e, 'edit');
                                                                    }}
                                                                >
                                                                    Bearbeiten
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    data-slotplan-pan-ignore
                                                                    className="cursor-pointer rounded border border-black bg-white px-2 py-0.5 font-bold hover:bg-gray-100"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedEntryId(null);
                                                                        handleEntryClick(entry, e, 'move');
                                                                    }}
                                                                >
                                                                    Verschieben
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    data-slotplan-pan-ignore
                                                                    className="cursor-pointer rounded border border-red-800 px-2 py-0.5 font-bold text-red-800 hover:bg-red-800/5"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleQuickDeleteEntry(entry);
                                                                    }}
                                                                >
                                                                    Löschen
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                                {minuteRows.map((minutesFromStart) => {
                                    const startsAt = addMinutes(activeDayView.startsAt, minutesFromStart);
                                    const rowStart = minutesFromStart / scheduleStepMinutes + 3;
                                    const showTime = startsAt.getMinutes() === 0 || startsAt.getMinutes() === 30;

                                    return (
                                        <div
                                            key={`time-${startsAt.toISOString()}`}
                                            className="sticky left-0 z-20 border-r border-b border-black/20 bg-gray-50 px-1 text-xs"
                                            style={{ gridRowStart: rowStart }}
                                        >
                                            {showTime && formatDate(startsAt, 'HH:mm')}
                                        </div>
                                    );
                                })}
                                {visibleLocations.map((location, locationIndex) =>
                                    minuteRows.map((minutesFromStart) => {
                                        const startsAt = addMinutes(activeDayView.startsAt, minutesFromStart);
                                        const rowStart = minutesFromStart / scheduleStepMinutes + 3;

                                        return (
                                            <button
                                                key={`cell-${location.id}-${startsAt.toISOString()}`}
                                                type="button"
                                                className="group cursor-inherit relative border-r border-b border-black/10 hover:bg-yellow-50"
                                                style={{ gridColumnStart: locationIndex + 2, gridRowStart: rowStart }}
                                                onClick={(e) => handleCellClick(location.id, startsAt, e, ScheduleEntryTimeMode.Timed)}
                                                title={`${location.name} ${formatDate(startsAt, 'HH:mm')}`}
                                            >
                                                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-bold text-black/25 opacity-0 group-hover:opacity-100">
                                                    +
                                                </span>
                                            </button>
                                        );
                                    }),
                                )}
                                {activeEntries
                                    .filter(
                                        (entry) =>
                                            entry.timeMode === ScheduleEntryTimeMode.Timed &&
                                            entry.startsAt !== null &&
                                            entry.endsAt !== null,
                                    )
                                    .map((entry) => {
                                        const locationIndex = visibleLocations.findIndex(({ id }) => id === entry.programLocationId);

                                        if (locationIndex < 0 || entry.startsAt === null || entry.endsAt === null) {
                                            return null;
                                        }

                                        const startsAt = new Date(entry.startsAt);
                                        const endsAt = new Date(entry.endsAt);
                                        const clippedStartsAt = isBefore(startsAt, activeDayView.startsAt)
                                            ? activeDayView.startsAt
                                            : startsAt;
                                        const clippedEndsAt = isAfter(endsAt, activeDayView.endsAt) ? activeDayView.endsAt : endsAt;
                                        const rowStart =
                                            differenceInMinutes(clippedStartsAt, activeDayView.startsAt) / scheduleStepMinutes + 3;
                                        const rowSpan = Math.max(
                                            1,
                                            differenceInMinutes(clippedEndsAt, clippedStartsAt) / scheduleStepMinutes,
                                        );
                                        const participant =
                                            entry.participantId === null
                                                ? undefined
                                                : participants.find(({ id }) => id === entry.participantId);
                                        const genres = participant === undefined ? [] : getParticipantGenres(participant.id);

                                        const isExpanded = expandedEntryId === entry.id;
                                        const statusLabel = getEntryStatusLabel(entry, participants);

                                        return (
                                            <div
                                                key={entry.id}
                                                className={cn(
                                                    'group cursor-inherit relative z-10 rounded border border-black text-xs shadow',
                                                    isExpanded && 'z-30',
                                                )}
                                                style={{
                                                    gridColumnStart: locationIndex + 2,
                                                    gridRowStart: rowStart,
                                                    gridRowEnd: `span ${rowSpan}`,
                                                    backgroundColor: getEntryColor(entry, participants),
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedEntryId(isExpanded ? null : entry.id);
                                                }}
                                            >
                                                <div
                                                    className={cn(
                                                        'overflow-hidden p-2 transition-opacity duration-150',
                                                        isExpanded ? 'opacity-0' : 'group-hover:opacity-0',
                                                    )}
                                                >
                                                    <div className="truncate font-bold">{getEntryLabel(entry, participants)}</div>
                                                    <div>
                                                        {formatDate(startsAt, 'HH:mm')} – {formatDate(endsAt, 'HH:mm')}
                                                    </div>
                                                </div>
                                                <div
                                                    className={cn(
                                                        'absolute -top-px -right-px -left-px z-50 flex origin-top flex-col gap-1 rounded border border-black p-2 shadow-lg transition-[opacity,transform] duration-150',
                                                        isExpanded
                                                            ? 'pointer-events-auto scale-105 opacity-100'
                                                            : 'pointer-events-none scale-100 opacity-0 group-hover:pointer-events-auto group-hover:scale-105 group-hover:opacity-100',
                                                    )}
                                                    style={{ backgroundColor: getEntryColor(entry, participants) }}
                                                >
                                                    <div className="font-bold">{getEntryLabel(entry, participants)}</div>
                                                    <div>
                                                        {formatDate(startsAt, 'HH:mm')} – {formatDate(endsAt, 'HH:mm')}
                                                    </div>
                                                    {participant !== undefined && <div>{typeLabels[participant.type]}</div>}
                                                    {statusLabel !== null && (
                                                        <div className="mt-0.5 inline-flex rounded bg-white/80 px-1 font-bold">
                                                            {statusLabel}
                                                        </div>
                                                    )}
                                                    {genres.length > 0 && <div className="truncate">{genres.join(', ')}</div>}
                                                    {!entry.isBlocking && <div className="text-[10px]">nicht blockierend</div>}
                                                    <div className="mt-1 flex flex-wrap gap-1">
                                                        <button
                                                            type="button"
                                                            data-slotplan-pan-ignore
                                                            className="cursor-pointer rounded border border-black bg-white px-2 py-0.5 font-bold hover:bg-gray-100"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setExpandedEntryId(null);
                                                                handleEntryClick(entry, e, 'edit');
                                                            }}
                                                        >
                                                            Bearbeiten
                                                        </button>
                                                        <button
                                                            type="button"
                                                            data-slotplan-pan-ignore
                                                            className="cursor-pointer rounded border border-black bg-white px-2 py-0.5 font-bold hover:bg-gray-100"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setExpandedEntryId(null);
                                                                handleEntryClick(entry, e, 'move');
                                                            }}
                                                        >
                                                            Verschieben
                                                        </button>
                                                        <button
                                                            type="button"
                                                            data-slotplan-pan-ignore
                                                            className="cursor-pointer rounded border border-red-800 px-2 py-0.5 font-bold text-red-800 hover:bg-red-800/5"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleQuickDeleteEntry(entry);
                                                            }}
                                                        >
                                                            Löschen
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <button
                        type="button"
                        className="cursor-pointer rounded border border-black bg-black px-4 py-2 font-bold text-white hover:bg-gray-800"
                        onClick={() => setEditedLocation(null)}
                    >
                        Programmort hinzufügen
                    </button>

                    {editedLocation !== undefined && (
                        <ProgramLocationForm
                            key={editedLocation?.id ?? 'new'}
                            location={editedLocation}
                            programLocationAreas={programLocationAreas}
                            onClose={() => setEditedLocation(undefined)}
                        />
                    )}

                    <div className="grid gap-3">
                        {programLocations.map((location) => (
                            <div key={location.id} className="rounded-md border border-black bg-white p-4 shadow">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-2">
                                        <LocationBadge location={location} />
                                        <div className="font-display text-2xl">{location.name}</div>
                                        <div className="text-sm text-black/60">
                                            Sortierung {location.sortOrder}
                                            {location.address !== null && ` · ${location.address}`}
                                        </div>
                                        {location.awarenessInfo !== null && <div className="text-sm">{location.awarenessInfo}</div>}
                                        {(location.latitude !== null || location.longitude !== null) && (
                                            <div className="text-xs text-black/60">
                                                {location.latitude ?? '-'}, {location.longitude ?? '-'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className="cursor-pointer rounded border border-black px-3 py-1 text-sm font-bold hover:bg-black/5"
                                            onClick={() => setEditedLocation(location)}
                                        >
                                            Bearbeiten
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isPending}
                                            className="cursor-pointer rounded border border-red-800 px-3 py-1 text-sm font-bold text-red-800 hover:bg-red-800/5 disabled:cursor-not-allowed disabled:opacity-50"
                                            onClick={() => handleDeleteLocationClick(location)}
                                        >
                                            Löschen / deaktivieren
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlotplanWorkspace;
