/*
  Warnings:

  - You are about to drop the column `updatedDescription` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedName` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Participant` DROP COLUMN `updatedDescription`,
    DROP COLUMN `updatedName`;
