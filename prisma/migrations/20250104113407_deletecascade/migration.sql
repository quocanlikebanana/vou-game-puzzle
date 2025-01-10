-- DropForeignKey
ALTER TABLE "Prize" DROP CONSTRAINT "Prize_gameOfEventId_fkey";

-- DropForeignKey
ALTER TABLE "Puzzle" DROP CONSTRAINT "Puzzle_gameOfEventId_fkey";

-- DropForeignKey
ALTER TABLE "UserPuzzle" DROP CONSTRAINT "UserPuzzle_gameOfEventId_fkey";

-- AddForeignKey
ALTER TABLE "Puzzle" ADD CONSTRAINT "Puzzle_gameOfEventId_fkey" FOREIGN KEY ("gameOfEventId") REFERENCES "PuzzleGame"("gameOfEventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prize" ADD CONSTRAINT "Prize_gameOfEventId_fkey" FOREIGN KEY ("gameOfEventId") REFERENCES "PuzzleGame"("gameOfEventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPuzzle" ADD CONSTRAINT "UserPuzzle_gameOfEventId_fkey" FOREIGN KEY ("gameOfEventId") REFERENCES "PuzzleGame"("gameOfEventId") ON DELETE CASCADE ON UPDATE CASCADE;
