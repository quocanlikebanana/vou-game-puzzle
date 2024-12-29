import { IsString } from "class-validator";

export default class ExchangeHistoryParam {
    @IsString()
    userId: string;

    @IsString()
    gameOfEventId: string;
}