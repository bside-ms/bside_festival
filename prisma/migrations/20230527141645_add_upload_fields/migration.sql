/*
  Warnings:

  - You are about to drop the column `techicalRider` on the `Participant` table. All the data in the column will be lost.
  - You are about to drop the column `techicalRiderFileName` on the `Participant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Participant` DROP COLUMN `techicalRider`,
    DROP COLUMN `techicalRiderFileName`,
    ADD COLUMN `technicalRider` TEXT NULL,
    ADD COLUMN `technicalRiderFileName` TEXT NULL;
