-- AlterTable
ALTER TABLE `Participant` ADD COLUMN `feeEuros` INTEGER NULL;

-- AlterTable
ALTER TABLE `ChangeLogEntry`
    MODIFY `action` ENUM(
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
        'ApplicationFeeUpdated',
        'ProgramSlotUpdated',
        'ProgramSlotDeleted',
        'ProgramVenueUpdated',
        'ProgramVenueDeleted',
        'ScheduleEntryCreated',
        'ScheduleEntryUpdated',
        'ScheduleEntryDeleted',
        'ProgramLocationCreated',
        'ProgramLocationUpdated',
        'ProgramLocationDeactivated',
        'ProgramLocationDeleted'
    ) NOT NULL;
