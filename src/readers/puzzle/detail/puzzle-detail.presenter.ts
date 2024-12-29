export default class PuzzleDetailPresenter {
    gameOfEventId: string;
    sizeX: number;
    sizeY: number;
    puzzleImage: string;
    allowTrade: boolean;
    puzzles: {
        order: number;
        rate: number;
    }[];
    prizes: {
        promotionId: string;
        amount: number;
    }[];
}