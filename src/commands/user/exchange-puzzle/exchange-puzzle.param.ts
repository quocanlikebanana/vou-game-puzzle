import { IsString } from "class-validator";

export default class ExchangePuzzleParam {
    @IsString()
    userId: string;

    @IsString()
    gameOfEventId: string;
}