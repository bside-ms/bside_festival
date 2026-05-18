import { ChangeLogAction, ChangeLogTargetType } from '@prisma/client';
import { describe, expect, it } from 'vitest';
import { formatChangeLogMessage } from './changeLogFormat';
import { createChange } from './createChange';

describe('changeLogFormat', () => {
    it('formats a single field change with actor and target snapshots', () => {
        const change = createChange('status', 'Status', 'Beworben', 'Bestätigt', (value) => value);

        expect(
            formatChangeLogMessage(
                {
                    action: ChangeLogAction.ApplicationStatusUpdated,
                    target: { type: ChangeLogTargetType.Application, id: 123, name: 'Test Band' },
                    changes: change === null ? [] : [change],
                },
                'Carsten',
                'carsten@example.com',
            ),
        ).toBe('Carsten (carsten@example.com) hat Status von "Beworben" zu "Bestätigt" für Bewerbung #123 "Test Band" geändert.');
    });

    it('formats multiple field changes as one save action', () => {
        const changes = [
            createChange('contactName', 'Ansprechperson', 'Alt', 'Neu', (value) => value),
            createChange('contactMail', 'E-Mail-Adresse', 'alt@example.com', 'neu@example.com', (value) => value),
        ].filter((change) => change !== null);

        expect(
            formatChangeLogMessage(
                {
                    action: ChangeLogAction.ApplicationContactInfoUpdated,
                    target: { type: ChangeLogTargetType.Application, id: 12, name: 'Infostand' },
                    changes,
                },
                null,
                'orga@example.com',
            ),
        ).toBe(
            'orga@example.com hat 2 Felder für Bewerbung #12 "Infostand" geändert: Ansprechperson von "Alt" zu "Neu"; E-Mail-Adresse von "alt@example.com" zu "neu@example.com".',
        );
    });

    it('does not create a change when raw values are equal', () => {
        expect(createChange('name', 'Name', 'B-Side', 'B-Side', (value) => value)).toBeNull();
    });
});
