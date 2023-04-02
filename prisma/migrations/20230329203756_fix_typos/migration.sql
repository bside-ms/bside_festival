/*
  Warnings:

  - You are about to drop the column `contacatMail` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `contacatName` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `contacatPhone` on the `participants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `participants` DROP COLUMN `contacatMail`,
    DROP COLUMN `contacatName`,
    DROP COLUMN `contacatPhone`,
    ADD COLUMN `contactMail` TEXT NULL,
    ADD COLUMN `contactName` TEXT NULL,
    ADD COLUMN `contactPhone` TEXT NULL;
