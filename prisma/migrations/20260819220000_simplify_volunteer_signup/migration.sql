-- AlterTable
ALTER TABLE `Volunteer`
    DROP COLUMN `canCook`,
    DROP COLUMN `hasCar`,
    DROP COLUMN `canCarryHeavyStuff`,
    DROP COLUMN `isSocial`,
    DROP COLUMN `canSupportTechnician`,
    DROP COLUMN `canSupportArtist`,
    DROP COLUMN `hasMultipleTalents`,
    DROP COLUMN `canWorkWithChildren`,
    DROP COLUMN `isAvailableOnFriday`,
    DROP COLUMN `isAvailableOnSaturday`,
    DROP COLUMN `isAvailableOnSunday`,
    DROP COLUMN `isAvailableBefore`,
    ADD COLUMN `emailVerified` DATETIME(3) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `VolunteerEmailVerificationToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `volunteerId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VolunteerEmailVerificationToken_token_key`(`token`),
    INDEX `VolunteerEmailVerificationToken_volunteerId_idx`(`volunteerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VolunteerEmailVerificationToken` ADD CONSTRAINT `VolunteerEmailVerificationToken_volunteerId_fkey` FOREIGN KEY (`volunteerId`) REFERENCES `Volunteer`(`int`) ON DELETE CASCADE ON UPDATE CASCADE;
