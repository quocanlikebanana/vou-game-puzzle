import { IsString } from "class-validator";

export default class RollPuzzleParam {
    @IsString()
    userId: string;

    @IsString()
    gameOfEventId: string;
}