/*
  Warnings:

  - Made the column `contactMail` on table `Participant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Participant` MODIFY `contactMail` TEXT NOT NULL;
