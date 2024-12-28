import { IsNumber, IsString } from "class-validator";

export default class TradePuzzleParam {
    @IsString()
    public readonly gameOfEventId: string;

    @IsString()
    public readonly giveUserId: string;

    @IsString()
    public readonly takeUserId: string;

    @IsNumber()
    public readonly order: number;

    @IsNumber()
    public readonly amount: number;
}