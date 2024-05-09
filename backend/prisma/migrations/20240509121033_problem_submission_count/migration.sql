/*
  Warnings:

  - Added the required column `acceptedCount` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submissionCount` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Problem` ADD COLUMN `acceptedCount` INTEGER NOT NULL,
    ADD COLUMN `submissionCount` INTEGER NOT NULL;
