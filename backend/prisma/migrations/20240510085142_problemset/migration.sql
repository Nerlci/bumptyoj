-- AlterTable
ALTER TABLE `Submission` ADD COLUMN `setId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ProblemSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL DEFAULT 0,
    `contestType` INTEGER NOT NULL DEFAULT 0,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `startTime` DATETIME(3) NULL,
    `endTime` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProblemToProblemSet` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProblemToProblemSet_AB_unique`(`A`, `B`),
    INDEX `_ProblemToProblemSet_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ClassToProblemSet` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ClassToProblemSet_AB_unique`(`A`, `B`),
    INDEX `_ClassToProblemSet_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProblemSetToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProblemSetToUser_AB_unique`(`A`, `B`),
    INDEX `_ProblemSetToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_setId_fkey` FOREIGN KEY (`setId`) REFERENCES `ProblemSet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProblemToProblemSet` ADD CONSTRAINT `_ProblemToProblemSet_A_fkey` FOREIGN KEY (`A`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProblemToProblemSet` ADD CONSTRAINT `_ProblemToProblemSet_B_fkey` FOREIGN KEY (`B`) REFERENCES `ProblemSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClassToProblemSet` ADD CONSTRAINT `_ClassToProblemSet_A_fkey` FOREIGN KEY (`A`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClassToProblemSet` ADD CONSTRAINT `_ClassToProblemSet_B_fkey` FOREIGN KEY (`B`) REFERENCES `ProblemSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProblemSetToUser` ADD CONSTRAINT `_ProblemSetToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `ProblemSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProblemSetToUser` ADD CONSTRAINT `_ProblemSetToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
