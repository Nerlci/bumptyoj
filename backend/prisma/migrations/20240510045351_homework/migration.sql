/*
  Warnings:

  - You are about to drop the column `classId` on the `ProblemSet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProblemSet` DROP FOREIGN KEY `ProblemSet_classId_fkey`;

-- AlterTable
ALTER TABLE `ProblemSet` DROP COLUMN `classId`;

-- CreateTable
CREATE TABLE `_ClassToProblemSet` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ClassToProblemSet_AB_unique`(`A`, `B`),
    INDEX `_ClassToProblemSet_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ClassToProblemSet` ADD CONSTRAINT `_ClassToProblemSet_A_fkey` FOREIGN KEY (`A`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ClassToProblemSet` ADD CONSTRAINT `_ClassToProblemSet_B_fkey` FOREIGN KEY (`B`) REFERENCES `ProblemSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
