import { IsArray, IsBoolean, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PuzzleRateParam {
    @IsNumber()
    order: number;

    @IsNumber()
    rate: number;
}

class PrizesParam {
    @IsString()
    promotionId: string;

    @IsNumber()
    amount: number;
}

export default class CreatePuzzleParam {
    @IsString()
    gameOfEventId: string;

    @IsNumber()
    sizeX: number;

    @IsNumber()
    sizeY: number;

    @IsString()
    puzzleImage: string;

    @IsBoolean()
    allowTrade: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PuzzleRateParam)
    puzzles: PuzzleRateParam[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PrizesParam)
    prizes: PrizesParam[];
}