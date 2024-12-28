import { IsString } from "class-validator";

export default class JoinPuzzleParam {
    @IsString()
    userId: string;

    @IsString()
    gameOfEventId: string;
}
