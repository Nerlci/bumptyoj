/*
  Warnings:

  - Added the required column `inputFilename` to the `Testdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputFilename` to the `Testdata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Testdata` ADD COLUMN `inputFilename` VARCHAR(191) NOT NULL,
    ADD COLUMN `outputFilename` VARCHAR(191) NOT NULL;
