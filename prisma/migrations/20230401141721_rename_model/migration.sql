/*
  Warnings:

  - You are about to drop the `participants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `participants`;

-- CreateTable
CREATE TABLE `Participant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `appliedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `contactName` TEXT NULL,
    `contactMail` TEXT NULL,
    `contactPhone` TEXT NULL,
    `description` TEXT NULL,
    `motivation` TEXT NULL,
    `curationScore` INTEGER NULL,
    `curationInfo` TEXT NULL,
    `address` TEXT NULL,
    `residence` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
