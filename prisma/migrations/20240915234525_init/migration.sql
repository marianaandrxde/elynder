/*
  Warnings:

  - You are about to drop the column `sexo` on the `Usuario` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('Masculino', 'Feminino');

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "sexo",
ADD COLUMN     "genero" "Genero";
