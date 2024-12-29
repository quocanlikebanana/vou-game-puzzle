import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import CreatePuzzleCommand from "src/commands/puzzle/create-puzzle/create-puzzle.command";
import CreatePuzzleParam from "src/commands/puzzle/create-puzzle/create-puzzle.param";
import PuzzleDetailParam from "src/readers/puzzle/detail/puzzle-detail.param";
import PuzzleDetailReader from "src/readers/puzzle/detail/puzzle-details.reader";

@Controller('puzzle-game')
export default class PuzzleGameController {
    constructor(
        private readonly createPuzzleCommand: CreatePuzzleCommand,
        private readonly puzzleDetailReader: PuzzleDetailReader
    ) { }

    @Post('create')
    async createPuzzle(@Body() createPuzzleParam: CreatePuzzleParam): Promise<void> {
        return await this.createPuzzleCommand.execute(createPuzzleParam);
    }

    @Get('detail/:gameOfEventId')
    async getPuzzleDetails(@Param('gameOfEventId') puzzleDetailParam: PuzzleDetailParam) {
        return await this.puzzleDetailReader.read(puzzleDetailParam);
    }
}