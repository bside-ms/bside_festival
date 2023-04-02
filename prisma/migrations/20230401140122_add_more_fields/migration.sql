/*
  Warnings:

  - Added the required column `updatedAt` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `participants` ADD COLUMN `address` TEXT NULL,
    ADD COLUMN `curationInfo` TEXT NULL,
    ADD COLUMN `curationScore` INTEGER NULL,
    ADD COLUMN `residence` TEXT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
