-- AlterTable
ALTER TABLE `Participant` MODIFY `type` ENUM('Concert', 'Workshop', 'Reading', 'Performance', 'FamilyProgram', 'Exhibition', 'Food', 'Neighbor', 'Misc', 'DiskJockey', 'InfoBooth', 'Catering') NOT NULL;
