/*
  Warnings:

  - You are about to drop the column `canCleanupAfterShow` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `canLiftHeavyStuff` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the column `hasDrivingLicense` on the `Volunteer` table. All the data in the column will be lost.
  - You are about to drop the `Preference` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Preference` DROP FOREIGN KEY `Preference_volunteerInt_fkey`;

-- AlterTable
ALTER TABLE `Volunteer` DROP COLUMN `canCleanupAfterShow`,
    DROP COLUMN `canLiftHeavyStuff`,
    DROP COLUMN `hasDrivingLicense`,
    ADD COLUMN `isAvailableOnSunday` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Preference`;
