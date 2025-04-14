/*
  Warnings:

  - You are about to drop the `ConcertGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiskJockeyGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipantConcertGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ParticipantDiskJockeyGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ParticipantConcertGenre` DROP FOREIGN KEY `ParticipantConcertGenre_genreId_fkey`;

-- DropForeignKey
ALTER TABLE `ParticipantConcertGenre` DROP FOREIGN KEY `ParticipantConcertGenre_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `ParticipantDiskJockeyGenre` DROP FOREIGN KEY `ParticipantDiskJockeyGenre_genreId_fkey`;

-- DropForeignKey
ALTER TABLE `ParticipantDiskJockeyGenre` DROP FOREIGN KEY `ParticipantDiskJockeyGenre_participantId_fkey`;

-- DropTable
DROP TABLE `ConcertGenre`;

-- DropTable
DROP TABLE `DiskJockeyGenre`;

-- DropTable
DROP TABLE `ParticipantConcertGenre`;

-- DropTable
DROP TABLE `ParticipantDiskJockeyGenre`;

-- CreateTable
CREATE TABLE `Genre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `type` ENUM('Concert', 'Workshop', 'Reading', 'Performance', 'FamilyProgram', 'Exhibition', 'Food', 'Neighbor', 'Misc', 'DiskJockey', 'InfoBooth', 'Catering') NOT NULL,

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
