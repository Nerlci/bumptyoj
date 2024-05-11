-- AlterTable
ALTER TABLE `Submission` ADD COLUMN `problemsetId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_problemsetId_fkey` FOREIGN KEY (`problemsetId`) REFERENCES `ProblemSet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
