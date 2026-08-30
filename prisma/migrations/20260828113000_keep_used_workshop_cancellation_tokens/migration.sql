ALTER TABLE `AttendeeCancellationToken`
    DROP FOREIGN KEY `AttendeeCancellationToken_attendeeId_fkey`;

ALTER TABLE `AttendeeCancellationToken`
    MODIFY `attendeeId` INTEGER NULL,
    ADD COLUMN `canceledAt` DATETIME(3) NULL;

ALTER TABLE `AttendeeCancellationToken`
    ADD CONSTRAINT `AttendeeCancellationToken_attendeeId_fkey`
    FOREIGN KEY (`attendeeId`) REFERENCES `Attendee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
