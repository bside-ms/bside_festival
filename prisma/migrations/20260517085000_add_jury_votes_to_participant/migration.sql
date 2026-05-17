-- AlterTable
ALTER TABLE `Participant`
    DROP COLUMN `curationScore`,
    DROP COLUMN `curationInfo`,
    ADD COLUMN `juryVotes` JSON NULL;
