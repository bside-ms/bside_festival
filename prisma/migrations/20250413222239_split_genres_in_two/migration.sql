/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipantGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ParticipantGenre` DROP FOREIGN KEY `ParticipantGenre_genreId_fkey`;

-- DropForeignKey
ALTER TABLE `ParticipantGenre` DROP FOREIGN KEY `ParticipantGenre_participantId_fkey`;

-- DropTable
DROP TABLE `Genre`;

-- DropTable
DROP TABLE `ParticipantGenre`;

-- CreateTable
CREATE TABLE `ConcertGenre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `genre` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParticipantConcertGenre` (
    `participantId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    PRIMARY KEY (`participantId`, `genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiskJockeyGenre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `genre` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParticipantDiskJockeyGenre` (
    `participantId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    PRIMARY KEY (`participantId`, `genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParticipantConcertGenre` ADD CONSTRAINT `ParticipantConcertGenre_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantConcertGenre` ADD CONSTRAINT `ParticipantConcertGenre_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `ConcertGenre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantDiskJockeyGenre` ADD CONSTRAINT `ParticipantDiskJockeyGenre_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantDiskJockeyGenre` ADD CONSTRAINT `ParticipantDiskJockeyGenre_genreId_fkey` FOREIGN KEY (`genreId`) REFERENCES `DiskJockeyGenre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
