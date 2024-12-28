import { PuzzleGame } from "@prisma/client";

export interface PuzzleGameCreateDto extends PuzzleGame {
    puzzles: {
        order: number;
        rate: number;
    }[];
    exchanges: {
        prizes: {
            promotionId: string;
            amount: number;
        }[];
        withPuzzles: {
            order: number;
            amount: number;
        }[];
    }[];
};