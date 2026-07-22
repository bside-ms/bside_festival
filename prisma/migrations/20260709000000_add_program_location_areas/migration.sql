CREATE TABLE `ProgramLocationArea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ProgramLocationArea_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ProgramLocation` DROP COLUMN `area`;
ALTER TABLE `ProgramLocation` ADD COLUMN `programLocationAreaId` INTEGER NULL;
ALTER TABLE `ProgramLocation` ADD INDEX `ProgramLocation_programLocationAreaId_idx`(`programLocationAreaId`);
ALTER TABLE `ProgramLocation` ADD CONSTRAINT `ProgramLocation_programLocationAreaId_fkey`
    FOREIGN KEY (`programLocationAreaId`) REFERENCES `ProgramLocationArea`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO `ProgramLocationArea` (`name`, `sortOrder`, `updatedAt`) VALUES ('B-Side', 0, NOW());

INSERT INTO `ProgramLocation` (`name`, `programLocationAreaId`, `sortOrder`, `updatedAt`) VALUES
    ('Saal',           1,    1, NOW()),
    ('Open Air Bühne', 1,    2, NOW()),
    ('Wohnzimmer',     1,    3, NOW()),
    ('Bewegungsraum',  1,    4, NOW()),
    ('Gruppenraum 01', 1,    5, NOW()),
    ('Gruppenraum 02', 1,    6, NOW()),
    ('Gruppenraum 03', 1,    7, NOW()),
    ('Flur',           1,    8, NOW()),
    ('Werkstatt',      1,    9, NOW()),
    ('Dachterrasse',   1,   10, NOW()),
    ('Kabinett',       NULL, 11, NOW()),
    ('Hansa Floß',     NULL, 12, NOW()),
    ('Wilma',          NULL, 13, NOW()),
    ('Babel',          NULL, 14, NOW()),
    ('Plan B',         NULL, 15, NOW()),
    ('Boulette',       NULL, 16, NOW()),
    ('AMP',            NULL, 17, NOW()),
    ('Tätowiersucht',  NULL, 18, NOW());
