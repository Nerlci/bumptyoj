/*
  Warnings:

  - You are about to drop the column `input` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `output` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Problem` DROP COLUMN `input`,
    DROP COLUMN `output`;

-- CreateTable
CREATE TABLE `Testdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `problemId` INTEGER NOT NULL,
    `input` VARCHAR(191) NOT NULL,
    `output` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Testdata` ADD CONSTRAINT `Testdata_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
