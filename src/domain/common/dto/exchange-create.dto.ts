export interface ExchangeCreateDto {
    gameOfEventId: string;
    prizes: {
        promotionId: string;
        amount: number;
    }[];
    withPuzzles: {
        order: number;
        amount: number;
    }[];
};