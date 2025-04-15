-- AlterTable
ALTER TABLE `Participant` ADD COLUMN `allergies` TEXT NULL,
    ADD COLUMN `diversityNotes` TEXT NULL,
    ADD COLUMN `hasFlintaParticipants` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasMarginalizedParticipants` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `participantCount` TEXT NULL;

-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `genre` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParticipantGenre` (
    `participantId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    PRIMARY KEY (`participantId`, `genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParticipantGenre` ADD CONSTRAINT `ParticipantGenre_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantGenre` ADD CONSTRAINT `ParticipantGenre_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `Genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
