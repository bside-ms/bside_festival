-- AlterTable
ALTER TABLE `Participant` MODIFY `participantCount` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `Zipcode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `participantId` INTEGER NOT NULL,
    `code` TEXT NOT NULL,
    `isInternational` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Zipcode` ADD CONSTRAINT `Zipcode_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
