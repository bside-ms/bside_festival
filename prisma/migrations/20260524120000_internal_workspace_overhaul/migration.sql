ALTER TABLE `Participant`
    MODIFY `status` ENUM(
        'Applied',
        'InConsideration',
        'Contacted',
        'WaitingForConfirmation',
        'Confirmed',
        'Rejected',
        'Canceled'
    ) NOT NULL DEFAULT 'Applied';

DELETE FROM `Comment`;

ALTER TABLE `Comment`
    DROP COLUMN `commentator`,
    CHANGE COLUMN `comment` `text` TEXT NOT NULL,
    CHANGE COLUMN `updatedAt` `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `authorUserId` TEXT NOT NULL,
    ADD COLUMN `authorName` TEXT NOT NULL,
    ADD COLUMN `statusTransition` ENUM(
        'Applied',
        'InConsideration',
        'Contacted',
        'WaitingForConfirmation',
        'Confirmed',
        'Rejected',
        'Canceled'
    ) NULL;

CREATE TABLE `ParticipantOrganizer` (
    `participantId` INTEGER NOT NULL,
    `organizerUserId` VARCHAR(191) NOT NULL,
    `organizerName` TEXT NOT NULL,

    PRIMARY KEY (`participantId`, `organizerUserId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ParticipantOrganizer`
    ADD CONSTRAINT `ParticipantOrganizer_participantId_fkey`
    FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
