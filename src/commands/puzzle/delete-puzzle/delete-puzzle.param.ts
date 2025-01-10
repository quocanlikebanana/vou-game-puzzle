import { IsString } from "class-validator";

export default class DeletePuzzleParam {
    @IsString()
    gameOfEventId: string;
}