-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_categoryId_fkey`;

-- DropIndex
DROP INDEX `Offer_categoryId_fkey` ON `Offer`;

-- AlterTable
ALTER TABLE `Offer` MODIFY `categoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
