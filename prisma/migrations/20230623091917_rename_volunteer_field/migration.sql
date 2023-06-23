/*
  Warnings:

  - You are about to drop the column `canLiftHeavtStuff` on the `Volunteer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Volunteer` DROP COLUMN `canLiftHeavtStuff`,
    ADD COLUMN `canLiftHeavyStuff` BOOLEAN NOT NULL DEFAULT false;
