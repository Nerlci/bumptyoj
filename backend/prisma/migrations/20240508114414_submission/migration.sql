-- CreateTable
CREATE TABLE `SubmissionDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submissionId` INTEGER NOT NULL,
    `testdataId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,
    `memory` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Submission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `problemId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `length` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `time` INTEGER NOT NULL,
    `memory` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubmissionDetail` ADD CONSTRAINT `SubmissionDetail_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubmissionDetail` ADD CONSTRAINT `SubmissionDetail_testdataId_fkey` FOREIGN KEY (`testdataId`) REFERENCES `Testdata`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
