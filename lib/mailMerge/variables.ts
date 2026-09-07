import { uniq } from 'lodash';

export const mailMergeVariableNames = ['name', 'ansprechperson', 'typ', 'termin', 'gage'] as const;

export type MailMergeVariableName = (typeof mailMergeVariableNames)[number];

export type MailMergeVariableValues = Record<MailMergeVariableName, string>;

export const mailMergeVariableExamples: Record<MailMergeVariableName, string> = {
    ansprechperson: 'Mira',
    gage: '150 €',
    name: 'Test Band',
    termin: 'Samstag, 19.09.26, 18:15–19:00 Uhr, Wohnzimmer',
    typ: 'DJs',
};

const createVariableTokenPattern = (): RegExp => /\{\{\s*([a-zA-Z]+)\s*\}\}/g;

const isMailMergeVariableName = (value: string): value is MailMergeVariableName => mailMergeVariableNames.some((name) => name === value);

const extractMailMergeTokens = (template: string): Array<string> => {
    const names = Array.from(template.matchAll(createVariableTokenPattern()), (match) => match[1]).filter(
        (name): name is string => name !== undefined,
    );

    return uniq(names);
};

export const extractUsedMailMergeVariables = (template: string): Array<MailMergeVariableName> =>
    extractMailMergeTokens(template).filter(isMailMergeVariableName);

export const findUnknownMailMergeVariables = (template: string): Array<string> =>
    extractMailMergeTokens(template).filter((name) => !isMailMergeVariableName(name));

export const insertTokenAtSelection = (
    value: string,
    token: string,
    start: number | null,
    end: number | null,
): { caret: number; next: string } => {
    const insertAt = start ?? value.length;
    const replaceUntil = end ?? insertAt;

    return {
        caret: insertAt + token.length,
        next: `${value.slice(0, insertAt)}${token}${value.slice(replaceUntil)}`,
    };
};

export const interpolateMailMergeTemplate = (template: string, values: MailMergeVariableValues, flattenNewlines = false): string =>
    template.replace(createVariableTokenPattern(), (_match, name: string) => {
        if (!isMailMergeVariableName(name)) {
            return `{{${name}}}`;
        }

        const value = values[name];

        return flattenNewlines ? value.replaceAll('\n', ', ') : value;
    });
