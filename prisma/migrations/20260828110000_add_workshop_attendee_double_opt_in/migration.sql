ALTER TABLE `Attendee`
    ADD COLUMN `message` TEXT NULL,
    ADD COLUMN `confirmedAt` DATETIME(3) NULL;

-- Registrations created by the former one-step flow remain valid.
UPDATE `Attendee` SET `confirmedAt` = `attendedAt` WHERE `confirmedAt` IS NULL;

CREATE INDEX `Attendee_confirmedAt_idx` ON `Attendee`(`confirmedAt`);

CREATE TABLE `AttendeeEmailVerificationToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attendeeId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AttendeeEmailVerificationToken_attendeeId_key`(`attendeeId`),
    UNIQUE INDEX `AttendeeEmailVerificationToken_token_key`(`token`),
    INDEX `AttendeeEmailVerificationToken_expires_idx`(`expires`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AttendeeCancellationToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `attendeeId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AttendeeCancellationToken_attendeeId_key`(`attendeeId`),
    UNIQUE INDEX `AttendeeCancellationToken_token_key`(`token`),
    INDEX `AttendeeCancellationToken_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `AttendeeEmailVerificationToken`
    ADD CONSTRAINT `AttendeeEmailVerificationToken_attendeeId_fkey`
    FOREIGN KEY (`attendeeId`) REFERENCES `Attendee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `AttendeeCancellationToken`
    ADD CONSTRAINT `AttendeeCancellationToken_attendeeId_fkey`
    FOREIGN KEY (`attendeeId`) REFERENCES `Attendee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
