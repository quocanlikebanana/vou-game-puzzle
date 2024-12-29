import { IsString } from "class-validator";

export default class TradeHistoryParam {
    @IsString()
    userId: string;

    @IsString()
    gameOfEventId: string;
}