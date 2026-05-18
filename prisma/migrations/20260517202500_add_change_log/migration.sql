-- CreateTable
CREATE TABLE `ChangeLogEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actorName` TEXT NULL,
    `actorEmail` TEXT NULL,
    `targetType` ENUM('Application', 'ProgramEntry') NOT NULL,
    `targetId` INTEGER NOT NULL,
    `targetName` TEXT NOT NULL,
    `action` ENUM(
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
        'ProgramSlotUpdated',
        'ProgramSlotDeleted',
        'ProgramVenueUpdated',
        'ProgramVenueDeleted'
    ) NOT NULL,
    `message` TEXT NOT NULL,
    `changes` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ChangeLogEntry_createdAt_idx` ON `ChangeLogEntry`(`createdAt`);

-- CreateIndex
CREATE INDEX `ChangeLogEntry_targetType_targetId_idx` ON `ChangeLogEntry`(`targetType`, `targetId`);

-- CreateIndex
CREATE INDEX `ChangeLogEntry_action_idx` ON `ChangeLogEntry`(`action`);
