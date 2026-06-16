import { ChangeLogAction, ChangeLogTargetType, type ApplicationStatus } from '@prisma/client';
import statusLabels from '../participants/status/statusLabels';

export const changeLogTargetTypeLabels: Record<ChangeLogTargetType, string> = {
    [ChangeLogTargetType.Application]: 'Bewerbung',
    [ChangeLogTargetType.ProgramEntry]: 'Programmeintrag',
};

export const changeLogActionLabels: Record<ChangeLogAction, string> = {
    [ChangeLogAction.ApplicationNameUpdated]: 'Name geändert',
    [ChangeLogAction.ApplicationDescriptionUpdated]: 'Beschreibung geändert',
    [ChangeLogAction.ApplicationMotivationUpdated]: 'Motivation geändert',
    [ChangeLogAction.ApplicationParticipantCountUpdated]: 'Personenzahl geändert',
    [ChangeLogAction.ApplicationDurationPreferenceUpdated]: 'Dauerwunsch geändert',
    [ChangeLogAction.ApplicationPastParticipationUpdated]: 'Frühere Teilnahme geändert',
    [ChangeLogAction.ApplicationJuryVotesUpdated]: 'Jury Votes geändert',
    [ChangeLogAction.ApplicationBookingInfoUpdated]: 'Booking-Informationen geändert',
    [ChangeLogAction.ApplicationDiversityInfoUpdated]: 'Diversitätsinformationen geändert',
    [ChangeLogAction.ApplicationAdditionalInfoUpdated]: 'Weitere Informationen geändert',
    [ChangeLogAction.ApplicationContactInfoUpdated]: 'Kontaktdaten geändert',
    [ChangeLogAction.ApplicationImageDeleted]: 'Bild gelöscht',
    [ChangeLogAction.ApplicationImageReplaced]: 'Bild ersetzt',
    [ChangeLogAction.ApplicationStatusUpdated]: 'Status geändert',
    [ChangeLogAction.ApplicationOrganizersUpdated]: 'Zuständigkeit geändert',
    [ChangeLogAction.ProgramSlotUpdated]: 'Slot geändert',
    [ChangeLogAction.ProgramSlotDeleted]: 'Slot gelöscht',
    [ChangeLogAction.ProgramVenueUpdated]: 'Venue geändert',
    [ChangeLogAction.ProgramVenueDeleted]: 'Venue gelöscht',
};

export const formatBoolean = (value: boolean): string => (value ? 'ja' : 'nein');

export const formatNullableText = (value: string | null | undefined): string => {
    if (value === null || value === undefined || value.trim().length === 0) {
        return 'keine Angabe';
    }

    return value;
};

export const formatNullableNumber = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
        return 'keine Angabe';
    }

    return value.toString();
};

export const formatApplicationStatus = (status: ApplicationStatus): string => statusLabels[status];

export const formatPastParticipation = (value: boolean | null): string => {
    if (value === null) {
        return 'unbekannt';
    }

    return value ? 'ja' : 'nein';
};

export type OrganizerChangeLogSnapshot = { organizerName: string; organizerUserId: string };

export const formatOrganizers = (organizers: Array<OrganizerChangeLogSnapshot>): string => {
    if (organizers.length === 0) {
        return 'niemand zugewiesen';
    }

    return organizers
        .map(({ organizerName }) => organizerName)
        .sort((left, right) => left.localeCompare(right, 'de-DE'))
        .join(', ');
};

export const formatJuryVotes = (juryVotes: Array<number> | null): string => {
    if (juryVotes === null || juryVotes.length === 0) {
        return 'keine Jury Votes';
    }

    return juryVotes.join(', ');
};

export const formatDateTime = (value: Date | string | null | undefined): string => {
    if (value === null || value === undefined) {
        return 'keine Angabe';
    }

    return new Intl.DateTimeFormat('de-DE', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Europe/Berlin',
    }).format(new Date(value));
};
