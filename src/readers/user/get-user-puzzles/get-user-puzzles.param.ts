import { IsString } from "class-validator";

export default class GetUserPuzzlesParam {
    @IsString()
    userId: string;

    @IsString()
    gameOfEventId: string;
}