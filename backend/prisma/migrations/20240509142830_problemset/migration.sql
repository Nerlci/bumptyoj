-- CreateTable
CREATE TABLE `ProblemSet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL DEFAULT 0,
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

-- AddForeignKey
ALTER TABLE `_ProblemToProblemSet` ADD CONSTRAINT `_ProblemToProblemSet_A_fkey` FOREIGN KEY (`A`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProblemToProblemSet` ADD CONSTRAINT `_ProblemToProblemSet_B_fkey` FOREIGN KEY (`B`) REFERENCES `ProblemSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
