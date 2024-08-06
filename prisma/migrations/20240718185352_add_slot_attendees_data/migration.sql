-- AlterTable
ALTER TABLE `Slot` ADD COLUMN `maxAttendees` INTEGER NULL;

-- CreateTable
CREATE TABLE `Attendee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` TEXT NOT NULL,
    `mailAddress` TEXT NOT NULL,
    `attendedAt` DATETIME(3) NOT NULL,
    `slotId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attendee` ADD CONSTRAINT `Attendee_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `Slot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
