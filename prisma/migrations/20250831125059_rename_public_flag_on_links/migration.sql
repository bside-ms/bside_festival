/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Link` DROP COLUMN `isPublic`,
    ADD COLUMN `isConfidential` BOOLEAN NOT NULL DEFAULT false;
