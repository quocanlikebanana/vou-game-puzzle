import ICommand from "src/common/app/command.i";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import DeletePuzzleParam from "./delete-puzzle.param";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class DeletePuzzleCommand implements ICommand<DeletePuzzleParam> {
    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) { }

    async execute(param: DeletePuzzleParam): Promise<void> {
        const { gameOfEventId } = param;
        await this.unitOfWork.puzzleGameRepository.delete(gameOfEventId);
    }
}