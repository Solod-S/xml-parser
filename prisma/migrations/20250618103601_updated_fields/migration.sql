/*
  Warnings:

  - You are about to drop the `Param` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Param` DROP FOREIGN KEY `Param_offerId_fkey`;

-- AlterTable
ALTER TABLE `Offer` ADD COLUMN `brandId` INTEGER NULL,
    ADD COLUMN `colorId` INTEGER NULL,
    ADD COLUMN `compatibleBrandId` INTEGER NULL,
    ADD COLUMN `compatibleDevicesId` INTEGER NULL,
    ADD COLUMN `formFactorId` INTEGER NULL,
    ADD COLUMN `materialId` INTEGER NULL,
    ADD COLUMN `surfaceId` INTEGER NULL,
    ADD COLUMN `typeId` INTEGER NULL,
    ADD COLUMN `viewId` INTEGER NULL;

-- DropTable
DROP TABLE `Param`;

-- CreateTable
CREATE TABLE `Attribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `nameUa` VARCHAR(255) NOT NULL,
    `type` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_compatibleBrandId_fkey` FOREIGN KEY (`compatibleBrandId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_compatibleDevicesId_fkey` FOREIGN KEY (`compatibleDevicesId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_surfaceId_fkey` FOREIGN KEY (`surfaceId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_viewId_fkey` FOREIGN KEY (`viewId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_formFactorId_fkey` FOREIGN KEY (`formFactorId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `Attribute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
