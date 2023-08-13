-- AlterTable
ALTER TABLE `Location` ADD COLUMN `address` TEXT NULL,
    ADD COLUMN `awarenessInfo` TEXT NULL,
    ADD COLUMN `latitude` FLOAT NULL,
    ADD COLUMN `longitude` FLOAT NULL;
