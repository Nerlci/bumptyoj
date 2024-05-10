-- AlterTable
ALTER TABLE `ProblemSet` ADD COLUMN `classId` INTEGER NULL;

-- CreateTable
CREATE TABLE `_ProblemSetToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProblemSetToUser_AB_unique`(`A`, `B`),
    INDEX `_ProblemSetToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProblemSet` ADD CONSTRAINT `ProblemSet_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProblemSetToUser` ADD CONSTRAINT `_ProblemSetToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `ProblemSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProblemSetToUser` ADD CONSTRAINT `_ProblemSetToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
