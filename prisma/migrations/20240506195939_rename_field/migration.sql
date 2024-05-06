/*
  Warnings:

  - You are about to drop the column `canShareBackline` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Participant` DROP COLUMN `canShareBackline`,
    ADD COLUMN `canProvideBackline` BOOLEAN NOT NULL DEFAULT false;
