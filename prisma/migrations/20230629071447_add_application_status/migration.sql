-- AlterTable
ALTER TABLE `Participant` ADD COLUMN `status` ENUM('Applied', 'Rejected', 'InProgress', 'WaitingForConfirmation', 'Confirmed') NOT NULL DEFAULT 'Applied';
