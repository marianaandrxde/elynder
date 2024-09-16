/*
  Warnings:

  - Added the required column `password` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "idade" DROP NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "sexo" DROP NOT NULL;
