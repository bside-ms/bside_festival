/*
  Warnings:

  - Added the required column `contacatMail` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contacatName` to the `participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contacatPhone` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `participants` ADD COLUMN `contacatMail` TEXT NOT NULL,
    ADD COLUMN `contacatName` TEXT NOT NULL,
    ADD COLUMN `contacatPhone` TEXT NOT NULL;
