import { IsString } from "class-validator";

export default class RollHistoryParam {
    @IsString()
    userId: string;

    @IsString()
    gameOfEventId: string;
}