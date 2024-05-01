-- CreateTable
CREATE TABLE `Problem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `displayId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `difficulty` VARCHAR(191) NOT NULL,
    `time` INTEGER NOT NULL,
    `memory` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `inputFormat` VARCHAR(191) NOT NULL,
    `outputFormat` VARCHAR(191) NOT NULL,
    `input` VARCHAR(191) NOT NULL,
    `output` VARCHAR(191) NOT NULL,
    `sampleInput` VARCHAR(191) NOT NULL,
    `sampleOutput` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
