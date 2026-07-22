-- Existing Slot/Venue/Location planning data is intentionally disposable for this project state.
DROP TABLE IF EXISTS `Attendee`;
DROP TABLE IF EXISTS `Venue`;
DROP TABLE IF EXISTS `Slot`;
DROP TABLE IF EXISTS `Location`;

CREATE TABLE `ProgramLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `area` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `address` TEXT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `awarenessInfo` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProgramLocation_isActive_idx`(`isActive`),
    INDEX `ProgramLocation_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ScheduleEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kind` ENUM('Participant', 'ScheduleNote') NOT NULL,
    `timeMode` ENUM('Timed', 'AllDay') NOT NULL,
    `startsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `allDayDates` JSON NULL,
    `title` TEXT NULL,
    `isBlocking` BOOLEAN NOT NULL DEFAULT true,
    `isPublic` BOOLEAN NOT NULL DEFAULT false,
    `maxAttendees` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `participantId` INTEGER NULL,
    `programLocationId` INTEGER NOT NULL,

    INDEX `ScheduleEntry_participantId_idx`(`participantId`),
    INDEX `ScheduleEntry_programLocationId_idx`(`programLocationId`),
    INDEX `ScheduleEntry_startsAt_idx`(`startsAt`),
    INDEX `ScheduleEntry_endsAt_idx`(`endsAt`),
    INDEX `ScheduleEntry_kind_idx`(`kind`),
    INDEX `ScheduleEntry_timeMode_idx`(`timeMode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Attendee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` TEXT NOT NULL,
    `mailAddress` TEXT NOT NULL,
    `attendedAt` DATETIME(3) NOT NULL,
    `scheduleEntryId` INTEGER NOT NULL,

    INDEX `Attendee_scheduleEntryId_idx`(`scheduleEntryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ScheduleEntry` ADD CONSTRAINT `ScheduleEntry_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ScheduleEntry` ADD CONSTRAINT `ScheduleEntry_programLocationId_fkey` FOREIGN KEY (`programLocationId`) REFERENCES `ProgramLocation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Attendee` ADD CONSTRAINT `Attendee_scheduleEntryId_fkey` FOREIGN KEY (`scheduleEntryId`) REFERENCES `ScheduleEntry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChangeLogEntry`
    MODIFY `targetType` ENUM('Application', 'ProgramEntry', 'ScheduleEntry', 'ProgramLocation') NOT NULL;

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
