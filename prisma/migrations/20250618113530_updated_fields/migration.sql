/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_brandId_fkey`;

-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_colorId_fkey`;

-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_compatibleBrandId_fkey`;

-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_compatibleDevicesId_fkey`;

-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_formFactorId_fkey`;

-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_surfaceId_fkey`;

-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_typeId_fkey`;

-- DropForeignKey
ALTER TABLE `Offer` DROP FOREIGN KEY `Offer_viewId_fkey`;

-- DropIndex
DROP INDEX `Offer_brandId_fkey` ON `Offer`;

-- DropIndex
DROP INDEX `Offer_colorId_fkey` ON `Offer`;

-- DropIndex
DROP INDEX `Offer_compatibleBrandId_fkey` ON `Offer`;

-- DropIndex
DROP INDEX `Offer_compatibleDevicesId_fkey` ON `Offer`;

-- DropIndex
DROP INDEX `Offer_formFactorId_fkey` ON `Offer`;

-- DropIndex
DROP INDEX `Offer_materialId_fkey` ON `Offer`;

-- DropIndex
DROP INDEX `Offer_surfaceId_fkey` ON `Offer`;

-- DropIndex
DROP INDEX `Offer_typeId_fkey` ON `Offer`;

-- DropIndex
DROP INDEX `Offer_viewId_fkey` ON `Offer`;

-- AlterTable
ALTER TABLE `Offer` DROP COLUMN `updatedAt`;

-- DropTable
DROP TABLE `Attribute`;

-- CreateTable
CREATE TABLE `Brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Brand_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompatibleBrand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CompatibleBrand_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompatibleDevices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CompatibleDevices_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Type_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Surface` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Surface_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `View` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `View_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormFactor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FormFactor_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Material_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Color` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Color_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_compatibleBrandId_fkey` FOREIGN KEY (`compatibleBrandId`) REFERENCES `CompatibleBrand`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_compatibleDevicesId_fkey` FOREIGN KEY (`compatibleDevicesId`) REFERENCES `CompatibleDevices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `Type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_surfaceId_fkey` FOREIGN KEY (`surfaceId`) REFERENCES `Surface`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_viewId_fkey` FOREIGN KEY (`viewId`) REFERENCES `View`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_formFactorId_fkey` FOREIGN KEY (`formFactorId`) REFERENCES `FormFactor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `Color`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
