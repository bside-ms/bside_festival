'use client';

import { getMailMergeRecipients, sendMailMergeMail, type MailMergeRecipient } from '@/lib/actions/mailMergeActions';
import { FESTIVAL_MAIL_FROM_LABEL } from '@/lib/mail/festivalMailAddresses';
import { MAIL_MERGE_TITLE } from '@/lib/mailMerge/copy';
import { clearMailMergeDraft, patchMailMergeDraft, readMailMergeDraft } from '@/lib/mailMerge/draftStorage';
import { isMailMergeReadyToSend, validateMailMergeTemplates, type MailMergeRecipientIssue } from '@/lib/mailMerge/validate';
import {
    insertTokenAtSelection,
    interpolateMailMergeTemplate,
    mailMergeVariableExamples,
    mailMergeVariableNames,
    type MailMergeVariableName,
} from '@/lib/mailMerge/variables';
import { first } from 'lodash';
import { useRouter } from 'next/navigation';
import type { ChangeEvent, ReactElement, MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

type ComposeField = 'body' | 'subject';

type WorkspacePhase = 'loading' | 'compose' | 'sending' | 'result';

type SendResult = {
    error?: string;
    id: number;
    name: string;
    ok: boolean;
};

const toVariableToken = (name: MailMergeVariableName): string => `{{${name}}}`;

const preventMouseDownDefault = (event: ReactMouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
};

const VariableHintRow = ({
    name,
    onInsert,
}: {
    name: MailMergeVariableName;
    onInsert: (name: MailMergeVariableName) => void;
}): ReactElement => {
    const token = toVariableToken(name);
    const handleClick = useCallback(() => onInsert(name), [name, onInsert]);

    return (
        <li>
            <button
                type="button"
                aria-label={`${token} einsetzen`}
                className="cursor-pointer font-mono text-black underline decoration-black/30 underline-offset-2 hover:decoration-black"
                onMouseDown={preventMouseDownDefault}
                onClick={handleClick}
            >
                {token}
            </button>
            <span className="text-black/50"> z. B. {mailMergeVariableExamples[name]}</span>
        </li>
    );
};

const toErrorMessage = (error: unknown): string => (error instanceof Error ? error.message : 'Unbekannter Fehler');

const formatIssueLine = (issue: MailMergeRecipientIssue): string => {
    const parts: Array<string> = [];

    if (issue.missingMail) {
        parts.push('keine E-Mail-Adresse');
    }

    if (issue.missingVariables.length > 0) {
        parts.push(issue.missingVariables.join(', '));
    }

    return `${issue.name}: ${parts.join('; ')}`;
};

const PreviewPager = ({
    currentIndex,
    onNext,
    onPrevious,
    total,
}: {
    currentIndex: number;
    onNext: () => void;
    onPrevious: () => void;
    total: number;
}): ReactElement => (
    <div className="flex items-center justify-between gap-2">
        <button
            type="button"
            disabled={currentIndex <= 0}
            className="cursor-pointer rounded border border-black bg-white px-2 py-1 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onPrevious}
        >
            Vorherige
        </button>
        <span className="text-xs text-black/60">
            {currentIndex + 1} / {total}
        </span>
        <button
            type="button"
            disabled={currentIndex >= total - 1}
            className="cursor-pointer rounded border border-black bg-white px-2 py-1 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onNext}
        >
            Nächste
        </button>
    </div>
);

const ResultRow = ({ result }: { result: SendResult }): ReactElement => (
    <li className="flex flex-wrap items-baseline justify-between gap-2 border-t border-black/10 py-2 text-sm">
        <span className="font-semibold">{result.name}</span>
        {result.ok ? (
            <span className="text-green-800">gesendet</span>
        ) : (
            <span className="text-red-800">{result.error ?? 'fehlgeschlagen'}</span>
        )}
    </li>
);

const MailMergeWorkspace = (): ReactElement => {
    const router = useRouter();
    const [phase, setPhase] = useState<WorkspacePhase>('loading');
    const [loadError, setLoadError] = useState<string | null>(null);
    const [recipients, setRecipients] = useState<Array<MailMergeRecipient>>([]);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [previewIndex, setPreviewIndex] = useState(0);
    const [results, setResults] = useState<Array<SendResult>>([]);
    const [sendingIndex, setSendingIndex] = useState(0);
    const [sendingIds, setSendingIds] = useState<Array<number>>([]);
    const cancelledRef = useRef(false);
    const sendingRef = useRef(false);
    const subjectRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);
    const lastFieldRef = useRef<ComposeField>('body');
    const pendingCaretRef = useRef<{ caret: number; field: ComposeField } | null>(null);

    const recipientById = useMemo(() => new Map(recipients.map((recipient) => [recipient.id, recipient])), [recipients]);
    const previewRecipient = recipients[previewIndex] ?? first(recipients);
    const validation = useMemo(() => validateMailMergeTemplates(subject, body, recipients), [body, recipients, subject]);
    const canSend = isMailMergeReadyToSend(subject, body, validation);
    const sentCount = results.filter((result) => result.ok).length;
    const failedResults = results.filter((result) => !result.ok);
    const sendingRecipient = recipientById.get(sendingIds[sendingIndex] ?? -1);

    useEffect(() => {
        const draft = readMailMergeDraft();

        if (draft.participantIds.length === 0) {
            router.replace('/intern');
            return;
        }

        setSubject(draft.subject);
        setBody(draft.body);

        void getMailMergeRecipients(draft.participantIds)
            .then((loaded) => {
                if (loaded.length === 0) {
                    setLoadError('Keine der ausgewählten Programmbeiträge wurden gefunden.');
                    setPhase('compose');
                    return;
                }

                setRecipients(loaded);
                setPhase('compose');
            })
            .catch((error: unknown) => {
                setLoadError(toErrorMessage(error));
                setPhase('compose');
            });
    }, [router]);

    useEffect(() => {
        if (phase !== 'compose') {
            return;
        }

        patchMailMergeDraft({ body, subject });
    }, [body, phase, subject]);

    useLayoutEffect(() => {
        const pending = pendingCaretRef.current;
        if (pending === null) {
            return;
        }

        pendingCaretRef.current = null;
        const element = pending.field === 'subject' ? subjectRef.current : bodyRef.current;
        element?.focus();
        element?.setSelectionRange(pending.caret, pending.caret);
    }, [body, subject]);

    useEffect(() => {
        if (phase !== 'sending') {
            sendingRef.current = false;
            return;
        }

        sendingRef.current = true;
        const leaveMessage = 'Das Senden läuft noch. Wenn du die Seite verlässt, werden die restlichen Mails nicht gesendet.';

        const handleBeforeUnload = (event: BeforeUnloadEvent): string => {
            event.preventDefault();
            event.returnValue = leaveMessage;
            return leaveMessage;
        };

        const handleDocumentClick = (event: MouseEvent): void => {
            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            const anchor = target.closest('a');
            if (anchor === null || !sendingRef.current) {
                return;
            }

            if (!window.confirm(leaveMessage)) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            cancelledRef.current = true;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('click', handleDocumentClick, true);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('click', handleDocumentClick, true);
        };
    }, [phase]);

    const handleSubjectChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setSubject(event.target.value), []);
    const handleBodyChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => setBody(event.target.value), []);
    const handleSubjectFocus = useCallback(() => {
        lastFieldRef.current = 'subject';
    }, []);
    const handleBodyFocus = useCallback(() => {
        lastFieldRef.current = 'body';
    }, []);
    const handleInsertVariable = useCallback((name: MailMergeVariableName) => {
        const token = toVariableToken(name);
        const field = lastFieldRef.current;
        const element = field === 'subject' ? subjectRef.current : bodyRef.current;

        if (element === null) {
            setBody((current) => `${current}${token}`);
            lastFieldRef.current = 'body';
            return;
        }

        const { caret, next } = insertTokenAtSelection(element.value, token, element.selectionStart, element.selectionEnd);
        pendingCaretRef.current = { caret, field };

        if (field === 'subject') {
            setSubject(next);
        } else {
            setBody(next);
        }
    }, []);
    const handlePreviousPreview = useCallback(() => setPreviewIndex((current) => Math.max(0, current - 1)), []);
    const handleNextPreview = useCallback(
        () => setPreviewIndex((current) => Math.min(recipients.length - 1, current + 1)),
        [recipients.length],
    );

    const sendToIds = useCallback(
        async (ids: Array<number>) => {
            cancelledRef.current = false;
            setSendingIds(ids);
            setSendingIndex(0);
            setResults([]);
            setPhase('sending');
            clearMailMergeDraft();

            const nextResults: Array<SendResult> = [];
            let index = 0;

            while (index < ids.length) {
                const id = ids[index];

                if (id === undefined || cancelledRef.current) {
                    break;
                }

                setSendingIndex(index);
                const recipient = recipientById.get(id);
                const name = recipient?.name ?? `#${id}`;

                try {
                    await sendMailMergeMail(id, subject, body);
                    nextResults.push({ id, name, ok: true });
                } catch (error) {
                    nextResults.push({ error: toErrorMessage(error), id, name, ok: false });
                }

                setResults([...nextResults]);
                index += 1;
            }

            sendingRef.current = false;
            setPhase('result');
        },
        [body, recipientById, subject],
    );

    const handleSend = useCallback(() => {
        if (!canSend) {
            return;
        }

        void sendToIds(recipients.map((recipient) => recipient.id));
    }, [canSend, recipients, sendToIds]);

    const handleRetryFailed = useCallback(() => {
        const failedIds = failedResults.map((result) => result.id);
        setRecipients((current) => current.filter((recipient) => failedIds.includes(recipient.id)));
        setPreviewIndex(0);
        void sendToIds(failedIds);
    }, [failedResults, sendToIds]);

    const handleBackToList = useCallback(() => {
        clearMailMergeDraft();
        router.push('/intern');
    }, [router]);

    const handleBackToSelection = useCallback(() => {
        const listSearch = readMailMergeDraft().listSearch;
        router.push(listSearch.length > 0 ? `/intern${listSearch}` : '/intern?mailMerge=true');
    }, [router]);

    if (phase === 'loading') {
        return <div className="text-sm text-black/60">Empfänger werden geladen…</div>;
    }

    if (phase === 'sending') {
        return (
            <div className="space-y-4">
                <h1 className="font-display text-4xl leading-none uppercase md:text-5xl">{MAIL_MERGE_TITLE}</h1>
                <div className="rounded-md border border-black bg-white p-5 shadow-lg">
                    <div className="font-bold">
                        Sende {sendingIndex + 1} von {sendingIds.length}…
                    </div>
                    <div className="mt-1 text-sm text-black/70">{sendingRecipient?.name ?? '—'}</div>
                    <div className="mt-3 h-2 overflow-hidden rounded bg-black/10">
                        <div
                            className="h-full bg-black transition-[width]"
                            style={{ width: `${sendingIds.length === 0 ? 0 : ((sendingIndex + 1) / sendingIds.length) * 100}%` }}
                        />
                    </div>
                    <p className="mt-4 text-sm text-black/70">Bitte die Seite nicht verlassen — das bricht das Senden ab.</p>
                    {results.length > 0 ? (
                        <p className="mt-2 text-sm">
                            {sentCount} gesendet
                            {failedResults.length > 0 ? ` · ${failedResults.length} fehlgeschlagen` : ''}
                        </p>
                    ) : null}
                </div>
            </div>
        );
    }

    if (phase === 'result') {
        return (
            <div className="space-y-4">
                <h1 className="font-display text-4xl leading-none uppercase md:text-5xl">{MAIL_MERGE_TITLE}</h1>
                <div className="rounded-md border border-black bg-white p-5 shadow-lg">
                    <div className="text-lg font-bold">
                        {sentCount} gesendet
                        {failedResults.length > 0 ? ` · ${failedResults.length} fehlgeschlagen` : ''}
                    </div>
                    {failedResults.length > 0 ? (
                        <p className="mt-2 text-sm text-red-800">
                            Nicht alle Mails sind rausgegangen. Du kannst die Fehlgeschlagenen erneut senden.
                        </p>
                    ) : (
                        <p className="mt-2 text-sm text-black/70">Alle Mails sind rausgegangen.</p>
                    )}
                    <ul className="mt-4">
                        {results.map((result) => (
                            <ResultRow key={result.id} result={result} />
                        ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {failedResults.length > 0 ? (
                            <button
                                type="button"
                                className="cursor-pointer rounded border border-black bg-black px-3 py-2 text-xs font-bold text-white"
                                onClick={handleRetryFailed}
                            >
                                Nur Fehlgeschlagene erneut senden
                            </button>
                        ) : null}
                        <button
                            type="button"
                            className="cursor-pointer rounded border border-black bg-white px-3 py-2 text-xs font-bold"
                            onClick={handleBackToList}
                        >
                            Zurück zu Programmbeiträge
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const unknownVariableLabels = validation.unknownVariables.map((name) => `{{${name}}}`).join(', ');
    const visibleIssues = validation.issues.slice(0, 20);
    const extraIssueCount = validation.issues.length - visibleIssues.length;
    const previewSubject = previewRecipient === undefined ? '' : interpolateMailMergeTemplate(subject, previewRecipient.values, true);
    const previewBody = previewRecipient === undefined ? '' : interpolateMailMergeTemplate(body, previewRecipient.values);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                    <h1 className="font-display text-4xl leading-none uppercase md:text-5xl">{MAIL_MERGE_TITLE}</h1>
                    <div className="mt-1 text-sm text-black/60">{recipients.length} Empfänger</div>
                </div>
                <button
                    type="button"
                    className="cursor-pointer rounded border border-black bg-white px-3 py-2 text-xs font-bold"
                    onClick={handleBackToSelection}
                >
                    Zurück zur Auswahl
                </button>
            </div>

            {loadError !== null ? (
                <div className="rounded-md border border-red-700 bg-red-50 p-3 text-sm text-red-900">{loadError}</div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3 rounded-md border border-black bg-white p-4 shadow-lg">
                    <label className="block text-xs font-bold tracking-wide uppercase">
                        Betreff
                        <input
                            ref={subjectRef}
                            value={subject}
                            className="mt-1 w-full rounded border border-black bg-white px-2 py-1.5 text-sm font-normal normal-case outline-0"
                            onChange={handleSubjectChange}
                            onFocus={handleSubjectFocus}
                        />
                    </label>
                    <label className="block text-xs font-bold tracking-wide uppercase">
                        Text
                        <textarea
                            ref={bodyRef}
                            value={body}
                            className="mt-1 min-h-72 w-full rounded border border-black bg-white px-2 py-1.5 text-sm font-normal normal-case outline-0"
                            onChange={handleBodyChange}
                            onFocus={handleBodyFocus}
                        />
                    </label>
                    <div className="space-y-1 text-xs text-black/70">
                        <p>Das sind Variablen, die du in Betreff und Text einsetzen kannst. Klick fügt sie an der Cursor-Position ein.</p>
                        <ul className="space-y-1">
                            {mailMergeVariableNames.map((name) => (
                                <VariableHintRow key={name} name={name} onInsert={handleInsertVariable} />
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-3 rounded-md border border-black bg-white p-4 shadow-lg">
                    <div className="text-xs font-bold tracking-wide uppercase">Vorschau</div>
                    {previewRecipient === undefined ? (
                        <p className="text-sm text-black/60">Keine Empfänger.</p>
                    ) : (
                        <>
                            <PreviewPager
                                currentIndex={previewIndex}
                                total={recipients.length}
                                onNext={handleNextPreview}
                                onPrevious={handlePreviousPreview}
                            />
                            <div className="space-y-1 rounded border border-black/15 bg-black/[0.03] p-3 text-sm">
                                <div>
                                    <span className="text-black/50">Von</span> {FESTIVAL_MAIL_FROM_LABEL}
                                </div>
                                <div>
                                    <span className="text-black/50">An</span> {previewRecipient.contactMail || '—'}
                                </div>
                                <div>
                                    <span className="text-black/50">Betreff</span> {previewSubject || '—'}
                                </div>
                            </div>
                            <div className="min-h-48 rounded border border-black/15 p-3 text-sm whitespace-pre-wrap">
                                {previewBody || '—'}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {validation.unknownVariables.length > 0 ? (
                <div className="rounded-md border border-red-700 bg-red-50 p-3 text-sm text-red-900">
                    Unbekannte Variable: {unknownVariableLabels}
                </div>
            ) : null}

            {validation.issues.length > 0 ? (
                <div className="rounded-md border border-red-700 bg-red-50 p-3 text-sm text-red-900">
                    <div className="font-bold">Senden nicht möglich, es fehlen Werte:</div>
                    <ul className="mt-2 list-disc pl-5">
                        {visibleIssues.map((issue) => (
                            <li key={issue.id}>{formatIssueLine(issue)}</li>
                        ))}
                    </ul>
                    {extraIssueCount > 0 ? <p className="mt-2">{extraIssueCount} weitere…</p> : null}
                </div>
            ) : null}

            <div className="flex justify-end">
                <button
                    type="button"
                    disabled={!canSend}
                    className="cursor-pointer rounded border border-black bg-black px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleSend}
                >
                    {recipients.length} Mails senden
                </button>
            </div>
        </div>
    );
};

export default MailMergeWorkspace;
