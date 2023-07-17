/*
  Warnings:

  - You are about to drop the column `additionalInformation` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedQuestions` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `preferredMessengers` on the `Volunteer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Volunteer` DROP COLUMN `additionalInformation`,
    DROP COLUMN `confirmedQuestions`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `preferredMessengers`,
    ADD COLUMN `canCarryHeavyStuff` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canCleanupAfterShow` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canCook` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canLiftHeavtStuff` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canSupportArtist` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canSupportTechnician` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `canWorkWithChildren` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasCar` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasDrivingLicense` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hasMultipleTalents` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isAvailableOnFriday` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isAvailableOnSaturday` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isSocial` BOOLEAN NOT NULL DEFAULT false;
