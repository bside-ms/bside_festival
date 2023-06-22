-- CreateTable
CREATE TABLE `Volunteer` (
    `int` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` TEXT NOT NULL,
    `mailAddress` TEXT NOT NULL,
    `phoneNumber` TEXT NOT NULL,
    `preferredMessengers` TEXT NOT NULL,
    `confirmedQuestions` TEXT NOT NULL,
    `additionalInformation` TEXT NOT NULL,
    `createdAt` TEXT NOT NULL,

    PRIMARY KEY (`int`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
