import ICommand from "src/common/app/command.i";
import { PuzzleGameCreateDto } from "src/domain/common/dto/puzzle-game-create.dto";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import CreatePuzzleParam from "./create-puzzle.param";
import { PuzzleGameAggregate } from "src/domain/puzzle/puzzle-game.agg";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class CreatePuzzleCommand implements ICommand<CreatePuzzleParam> {
    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) { }

    async execute(param: CreatePuzzleParam): Promise<void> {
        const puzzleGame = PuzzleGameAggregate.create(param as PuzzleGameCreateDto);
        await this.unitOfWork.puzzleGameRepository.create(puzzleGame);
    }
}