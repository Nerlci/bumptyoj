-- AlterTable
ALTER TABLE `Comment` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `content` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Problem` MODIFY `description` TEXT NOT NULL,
    MODIFY `inputFormat` TEXT NOT NULL,
    MODIFY `outputFormat` TEXT NOT NULL,
    MODIFY `sampleInput` TEXT NOT NULL,
    MODIFY `sampleOutput` TEXT NOT NULL,
    MODIFY `other` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `ProblemSet` MODIFY `description` TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Submission` MODIFY `code` TEXT NOT NULL;
