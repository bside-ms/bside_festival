-- CreateTable
CREATE TABLE `Preference` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` TEXT NOT NULL,
    `label` TEXT NOT NULL,
    `emoji` TEXT NOT NULL,
    `volunteerInt` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Preference` ADD CONSTRAINT `Preference_volunteerInt_fkey` FOREIGN KEY (`volunteerInt`) REFERENCES `Volunteer`(`int`) ON DELETE SET NULL ON UPDATE CASCADE;
