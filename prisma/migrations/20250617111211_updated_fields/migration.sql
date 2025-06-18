/*
  Warnings:

  - You are about to alter the column `currencyId` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `vendor` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `barcode` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `ean` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `name` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Offer` MODIFY `name` TEXT NULL,
    MODIFY `nameUa` TEXT NULL,
    MODIFY `currencyId` VARCHAR(10) NULL,
    MODIFY `vendor` VARCHAR(100) NULL,
    MODIFY `barcode` VARCHAR(100) NULL,
    MODIFY `description` LONGTEXT NULL,
    MODIFY `descriptionUa` LONGTEXT NULL,
    MODIFY `ean` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `Param` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `value` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Picture` MODIFY `url` TEXT NOT NULL;
