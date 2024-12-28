-- CreateTable
CREATE TABLE "PuzzleGame" (
    "gameOfEventId" TEXT NOT NULL,
    "sizeX" INTEGER NOT NULL,
    "sizeY" INTEGER NOT NULL,
    "puzzleImage" TEXT NOT NULL,
    "allowTrate" BOOLEAN NOT NULL,

    CONSTRAINT "PuzzleGame_pkey" PRIMARY KEY ("gameOfEventId")
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "gameOfEventId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL,
    "gameOfEventId" TEXT NOT NULL,

    CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exchange_With_Puzzle" (
    "puzzleId" TEXT NOT NULL,
    "exchangeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Exchange_With_Puzzle_pkey" PRIMARY KEY ("puzzleId","exchangeId")
);

-- CreateTable
CREATE TABLE "Exchange_Prize" (
    "promotionId" TEXT NOT NULL,
    "exchangeId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Exchange_Prize_pkey" PRIMARY KEY ("promotionId","exchangeId")
);

-- CreateTable
CREATE TABLE "UserPuzzle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameOfEventId" TEXT NOT NULL,

    CONSTRAINT "UserPuzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Has_Puzzle" (
    "userPuzzleId" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "User_Has_Puzzle_pkey" PRIMARY KEY ("userPuzzleId","puzzleId")
);

-- CreateTable
CREATE TABLE "User_Roll_Puzzle" (
    "userPuzzleId" TEXT NOT NULL,
    "puzzleId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Roll_Puzzle_pkey" PRIMARY KEY ("userPuzzleId","puzzleId")
);

-- CreateTable
CREATE TABLE "User_Do_Exchange" (
    "userPuzzleId" TEXT NOT NULL,
    "exchangeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_Do_Exchange_pkey" PRIMARY KEY ("userPuzzleId","exchangeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Puzzle_gameOfEventId_order_key" ON "Puzzle"("gameOfEventId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "UserPuzzle_userId_gameOfEventId_key" ON "UserPuzzle"("userId", "gameOfEventId");

-- AddForeignKey
ALTER TABLE "Puzzle" ADD CONSTRAINT "Puzzle_gameOfEventId_fkey" FOREIGN KEY ("gameOfEventId") REFERENCES "PuzzleGame"("gameOfEventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_gameOfEventId_fkey" FOREIGN KEY ("gameOfEventId") REFERENCES "PuzzleGame"("gameOfEventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_With_Puzzle" ADD CONSTRAINT "Exchange_With_Puzzle_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_With_Puzzle" ADD CONSTRAINT "Exchange_With_Puzzle_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange_Prize" ADD CONSTRAINT "Exchange_Prize_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPuzzle" ADD CONSTRAINT "UserPuzzle_gameOfEventId_fkey" FOREIGN KEY ("gameOfEventId") REFERENCES "PuzzleGame"("gameOfEventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Has_Puzzle" ADD CONSTRAINT "User_Has_Puzzle_userPuzzleId_fkey" FOREIGN KEY ("userPuzzleId") REFERENCES "UserPuzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Has_Puzzle" ADD CONSTRAINT "User_Has_Puzzle_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Roll_Puzzle" ADD CONSTRAINT "User_Roll_Puzzle_userPuzzleId_fkey" FOREIGN KEY ("userPuzzleId") REFERENCES "UserPuzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Roll_Puzzle" ADD CONSTRAINT "User_Roll_Puzzle_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Do_Exchange" ADD CONSTRAINT "User_Do_Exchange_userPuzzleId_fkey" FOREIGN KEY ("userPuzzleId") REFERENCES "UserPuzzle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Do_Exchange" ADD CONSTRAINT "User_Do_Exchange_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
