-- CreateTable
CREATE TABLE `ActionErrorLogEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actorName` TEXT NULL,
    `actorEmail` TEXT NULL,
    `source` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `stack` TEXT NULL,
    `targetType` VARCHAR(64) NULL,
    `targetId` INTEGER NULL,
    `context` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ActionErrorLogEntry_createdAt_idx` ON `ActionErrorLogEntry`(`createdAt`);

-- CreateIndex
CREATE INDEX `ActionErrorLogEntry_source_idx` ON `ActionErrorLogEntry`(`source`);

-- CreateIndex
CREATE INDEX `ActionErrorLogEntry_targetType_targetId_idx` ON `ActionErrorLogEntry`(`targetType`, `targetId`);
