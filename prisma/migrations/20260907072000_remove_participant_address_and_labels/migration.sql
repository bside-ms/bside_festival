DROP TABLE IF EXISTS `ParticipantLabel`;

DROP TABLE IF EXISTS `Label`;

ALTER TABLE `Participant` DROP COLUMN IF EXISTS `address`;

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
        'ApplicationLinkUpdated',
        'ApplicationImageDeleted',
        'ApplicationImageReplaced',
        'ApplicationStatusUpdated',
        'ApplicationOrganizersUpdated',
        'ApplicationFeeUpdated',
        'ApplicationTypeAndGenresUpdated',
        'ApplicationLinksUpdated',
        'ApplicationZipcodesUpdated',
        'ApplicationTechnicalRiderUpdated',
        'ApplicationBacklineSharingUpdated',
        'ApplicationAllergiesUpdated',
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
