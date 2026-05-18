import { changeLogActionLabels, changeLogTargetTypeLabels, formatDateTime } from '@/lib/changeLog/changeLogLabels';
import prismaClient from '@/lib/common/prismaClient';
import getUserSession from '@/lib/next-auth/getUserSession';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import { ChangeLogAction, ChangeLogTargetType, type Prisma } from '@prisma/client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

const pageSize = 50;

interface Props {
    searchParams: Promise<Record<string, string | string[]>>;
}

const getSearchParam = (searchParams: Record<string, string | string[]>, name: string): string | undefined => {
    const value = searchParams[name];

    return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
};

const isChangeLogTargetType = (value: string | undefined): value is ChangeLogTargetType =>
    value !== undefined && Object.values(ChangeLogTargetType).includes(value as ChangeLogTargetType);

const isChangeLogAction = (value: string | undefined): value is ChangeLogAction =>
    value !== undefined && Object.values(ChangeLogAction).includes(value as ChangeLogAction);

const createLoadMoreHref = (searchParams: Record<string, string | string[]>, limit: number): string => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
        if (key === 'limit') {
            return;
        }

        if (typeof value === 'string' && value.trim().length > 0) {
            params.set(key, value);
        }
    });
    params.set('limit', (limit + pageSize).toString());

    return `/aenderungslog?${params.toString()}`;
};

export default async ({ searchParams }: Props): Promise<ReactElement> => {
    const user = await getUserSession();

    if (user === null || !user.keycloakGroups?.includes(dataPrivacyGroup)) {
        redirect('/');
    }

    const resolvedSearchParams = await searchParams;
    const text = getSearchParam(resolvedSearchParams, 'text');
    const targetType = getSearchParam(resolvedSearchParams, 'targetType');
    const action = getSearchParam(resolvedSearchParams, 'action');
    const targetIdText = getSearchParam(resolvedSearchParams, 'targetId');
    const targetId = targetIdText === undefined ? undefined : Number(targetIdText);
    const limitText = getSearchParam(resolvedSearchParams, 'limit');
    const parsedLimit = limitText === undefined ? undefined : Number(limitText);
    const limit = parsedLimit === undefined || !Number.isFinite(parsedLimit) ? pageSize : Math.max(pageSize, parsedLimit);

    const where: Prisma.ChangeLogEntryWhereInput = {
        ...(isChangeLogTargetType(targetType) ? { targetType } : {}),
        ...(isChangeLogAction(action) ? { action } : {}),
        ...(targetId !== undefined && Number.isInteger(targetId) ? { targetId } : {}),
        ...(text !== undefined
            ? {
                  OR: [
                      { actorName: { contains: text } },
                      { actorEmail: { contains: text } },
                      { message: { contains: text } },
                      { targetName: { contains: text } },
                  ],
              }
            : {}),
    };

    const entries = await prismaClient.changeLogEntry.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        where,
    });
    const visibleEntries = entries.slice(0, limit);
    const hasMore = entries.length > limit;

    return (
        <main className="relative mx-auto min-h-screen w-full max-w-6xl px-3 pt-5 pb-8">
            <h1 className="text-center font-display text-6xl uppercase">Änderungslog</h1>
            <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-gray-800">
                Erfolgreiche Änderungen an Bewerbungen und Programmeinträgen. Sichtbar nur für Datenschutz-Berechtigte.
            </p>

            <form className="mt-6 grid gap-3 rounded border border-black/10 bg-white/70 p-4 md:grid-cols-4">
                <label className="text-sm">
                    Suche
                    <input
                        className="mt-1 w-full rounded border border-black/20 bg-white px-2 py-1"
                        defaultValue={text ?? ''}
                        name="text"
                        placeholder="Name, E-Mail, Nachricht"
                    />
                </label>

                <label className="text-sm">
                    Ziel
                    <select
                        className="mt-1 w-full rounded border border-black/20 bg-white px-2 py-1"
                        defaultValue={targetType ?? ''}
                        name="targetType"
                    >
                        <option value="">Alle</option>
                        {Object.values(ChangeLogTargetType).map((value) => (
                            <option key={value} value={value}>
                                {changeLogTargetTypeLabels[value]}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm">
                    Aktion
                    <select
                        className="mt-1 w-full rounded border border-black/20 bg-white px-2 py-1"
                        defaultValue={action ?? ''}
                        name="action"
                    >
                        <option value="">Alle</option>
                        {Object.values(ChangeLogAction).map((value) => (
                            <option key={value} value={value}>
                                {changeLogActionLabels[value]}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm">
                    ID
                    <input
                        className="mt-1 w-full rounded border border-black/20 bg-white px-2 py-1"
                        defaultValue={targetIdText ?? ''}
                        inputMode="numeric"
                        name="targetId"
                        placeholder="Bewerbungs- oder Programmeintrags-ID"
                    />
                </label>

                <div className="flex items-end gap-2 md:col-span-4">
                    <button className="rounded bg-black px-4 py-2 text-sm text-white" type="submit">
                        Filtern
                    </button>
                    <Link className="rounded border border-black/20 px-4 py-2 text-sm text-black no-underline" href="/aenderungslog">
                        Zurücksetzen
                    </Link>
                </div>
            </form>

            <div className="mt-6 space-y-3">
                {visibleEntries.length === 0 ? (
                    <div className="rounded border border-black/10 bg-white/70 p-4 text-sm text-gray-700">Keine Änderungen gefunden.</div>
                ) : (
                    visibleEntries.map((entry) => (
                        <article key={entry.id} className="rounded border border-black/10 bg-white/80 p-4 shadow-sm">
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                <span>{formatDateTime(entry.createdAt)}</span>
                                <span>·</span>
                                <span>{changeLogTargetTypeLabels[entry.targetType]}</span>
                                <span>#{entry.targetId}</span>
                                <span>·</span>
                                <span>{changeLogActionLabels[entry.action]}</span>
                            </div>
                            <div className="mt-2 text-sm whitespace-pre-wrap text-black">{entry.message}</div>
                        </article>
                    ))
                )}
            </div>

            {hasMore && (
                <div className="mt-6 text-center">
                    <Link
                        className="rounded bg-black px-4 py-2 text-sm text-white no-underline"
                        href={createLoadMoreHref(resolvedSearchParams, limit)}
                    >
                        Mehr laden
                    </Link>
                </div>
            )}
        </main>
    );
};
