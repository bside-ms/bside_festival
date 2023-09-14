-- AlterTable
ALTER TABLE `Participant` MODIFY `status` ENUM('Applied', 'Rejected', 'InProgress', 'WaitingForConfirmation', 'Confirmed', 'Canceled') NOT NULL DEFAULT 'Applied';
