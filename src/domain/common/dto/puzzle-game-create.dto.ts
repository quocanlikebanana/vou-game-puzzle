import { PuzzleGame } from "@prisma/client";

export interface PuzzleGameCreateDto extends PuzzleGame {
    puzzles: {
        order: number;
        rate: number;
    }[];
    prizes: {
        promotionId: string;
        amount: number;
    }[];
};