-- AlterTable
ALTER TABLE `ChangeLogEntry` MODIFY `action` ENUM(
    'ApplicationNameUpdated',
    'ApplicationDescriptionUpdated',
    'ApplicationMotivationUpdated',
    'ApplicationParticipantCountUpdated',
    'ApplicationDurationPreferenceUpdated',
    'ApplicationPastParticipationUpdated',
    'ApplicationJuryVotesUpdated',
    'ApplicationBookingInfoUpdated',
    'ApplicationDiversityInfoUpdated',
    'ApplicationAdditionalInfoUpdated',
    'ApplicationContactInfoUpdated',
    'ApplicationImageDeleted',
    'ApplicationImageReplaced',
    'ApplicationStatusUpdated',
    'ApplicationOrganizersUpdated',
    'ProgramSlotUpdated',
    'ProgramSlotDeleted',
    'ProgramVenueUpdated',
    'ProgramVenueDeleted'
) NOT NULL;
