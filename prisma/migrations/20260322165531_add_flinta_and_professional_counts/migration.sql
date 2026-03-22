/*
  Warnings:

  - You are about to drop the column `hasFlintaParticipants` on the `Participant` table. All the data in the column will be lost.
  - Made the column `participantCount` on table `Participant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Participant` DROP COLUMN `hasFlintaParticipants`,
    ADD COLUMN `flintaParticipantsCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `professionalParticipantsCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `participantCount` INTEGER NOT NULL DEFAULT 1;
