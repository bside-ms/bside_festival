/*
  Warnings:

  - You are about to drop the column `canProvideBackline` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Participant` DROP COLUMN `canProvideBackline`,
    ADD COLUMN `backlineSharing` TEXT NULL;
