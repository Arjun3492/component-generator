/*
  Warnings:

  - You are about to drop the `radius` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `spacing` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `backgroundColor` on the `component_style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `textColor` on the `component_style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `borderColor` on the `component_style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `borderRadius` on the `component_style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paddingX` on the `component_style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `paddingY` on the `component_style` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "radius" DROP CONSTRAINT "radius_projectId_fkey";

-- DropForeignKey
ALTER TABLE "spacing" DROP CONSTRAINT "spacing_projectId_fkey";

-- AlterTable
ALTER TABLE "component_style" DROP COLUMN "backgroundColor",
ADD COLUMN     "backgroundColor" INTEGER NOT NULL,
DROP COLUMN "textColor",
ADD COLUMN     "textColor" INTEGER NOT NULL,
DROP COLUMN "borderColor",
ADD COLUMN     "borderColor" INTEGER NOT NULL,
DROP COLUMN "borderRadius",
ADD COLUMN     "borderRadius" INTEGER NOT NULL,
DROP COLUMN "paddingX",
ADD COLUMN     "paddingX" INTEGER NOT NULL,
DROP COLUMN "paddingY",
ADD COLUMN     "paddingY" INTEGER NOT NULL;

-- DropTable
DROP TABLE "radius";

-- DropTable
DROP TABLE "spacing";

-- CreateTable
CREATE TABLE "Radius" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Radius_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spacing" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Spacing_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Radius" ADD CONSTRAINT "Radius_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spacing" ADD CONSTRAINT "Spacing_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_style" ADD CONSTRAINT "component_style_backgroundColor_fkey" FOREIGN KEY ("backgroundColor") REFERENCES "color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_style" ADD CONSTRAINT "component_style_textColor_fkey" FOREIGN KEY ("textColor") REFERENCES "color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_style" ADD CONSTRAINT "component_style_borderColor_fkey" FOREIGN KEY ("borderColor") REFERENCES "color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_style" ADD CONSTRAINT "component_style_borderRadius_fkey" FOREIGN KEY ("borderRadius") REFERENCES "Radius"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_style" ADD CONSTRAINT "component_style_paddingX_fkey" FOREIGN KEY ("paddingX") REFERENCES "Spacing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "component_style" ADD CONSTRAINT "component_style_paddingY_fkey" FOREIGN KEY ("paddingY") REFERENCES "Spacing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
