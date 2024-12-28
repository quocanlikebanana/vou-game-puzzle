/*
  Warnings:

  - You are about to drop the column `allowTrate` on the `PuzzleGame` table. All the data in the column will be lost.
  - Added the required column `allowTrade` to the `PuzzleGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PuzzleGame" DROP COLUMN "allowTrate",
ADD COLUMN     "allowTrade" BOOLEAN NOT NULL;
