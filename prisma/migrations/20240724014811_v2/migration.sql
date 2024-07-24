/*
  Warnings:

  - You are about to drop the column `stylesId` on the `component` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "component_stylesId_key";

-- AlterTable
ALTER TABLE "component" DROP COLUMN "stylesId";
