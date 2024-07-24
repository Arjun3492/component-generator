/*
  Warnings:

  - A unique constraint covering the columns `[stylesId]` on the table `component` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[componentId]` on the table `component_style` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stylesId` to the `component` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "component" ADD COLUMN     "stylesId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "component_stylesId_key" ON "component"("stylesId");

-- CreateIndex
CREATE UNIQUE INDEX "component_style_componentId_key" ON "component_style"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "project_userId_name_key" ON "project"("userId", "name");
