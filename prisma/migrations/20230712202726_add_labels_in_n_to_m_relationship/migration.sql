/*
  Warnings:

  - You are about to drop the column `color` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `Label` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Label` DROP FOREIGN KEY `Label_participantId_fkey`;

-- AlterTable
ALTER TABLE `Label` DROP COLUMN `color`,
    DROP COLUMN `participantId`;

-- CreateTable
CREATE TABLE `ParticipantLabel` (
    `participantId` INTEGER NOT NULL,
    `labelId` INTEGER NOT NULL,

    PRIMARY KEY (`participantId`, `labelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ParticipantLabel` ADD CONSTRAINT `ParticipantLabel_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `Participant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipantLabel` ADD CONSTRAINT `ParticipantLabel_labelId_fkey` FOREIGN KEY (`labelId`) REFERENCES `Label`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
