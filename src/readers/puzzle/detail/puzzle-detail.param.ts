import { IsString } from "class-validator";

export default class PuzzleDetailParam {
    @IsString()
    gameOfEventId: string;
}