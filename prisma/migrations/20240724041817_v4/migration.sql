/*
  Warnings:

  - A unique constraint covering the columns `[projectId,type,variant]` on the table `component` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "component_projectId_type_variant_key" ON "component"("projectId", "type", "variant");
