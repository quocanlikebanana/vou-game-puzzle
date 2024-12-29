import ICommand from "src/common/app/command.i";
import RollPuzzleParam from "./roll-puzzle.param";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import { PuzzleAmountValueObject } from "src/domain/common/vo/puzzle-amount.vo";
import { DomainError } from "src/common/error/domain.error";

export default class RollPuzzleCommand implements ICommand<RollPuzzleParam> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
    ) { }

    async execute(param: RollPuzzleParam): Promise<void> {
        const { userId, gameOfEventId } = param;
        const puzzleGame = await this.unitOfWork.puzzleGameRepository.getById(gameOfEventId);
        if (!puzzleGame) {
            throw new DomainError('Puzzle game not found');
        }
        const userPuzzle = await this.unitOfWork.userPuzzleRepository.getByUnique(userId, gameOfEventId);
        if (!userPuzzle) {
            throw new DomainError('User puzzle not found');
        }
        const order = puzzleGame.rollPuzzle().order;
        const puzzleRollValueObject = userPuzzle.doRoll(order);
        const puzzleAmount = new PuzzleAmountValueObject({
            order,
            amount: 1
        });
        await this.unitOfWork.userPuzzleRepository.addRollPuzzle(userPuzzle, puzzleRollValueObject);
        await this.unitOfWork.userPuzzleRepository.updateHasPuzzle(userPuzzle, puzzleAmount);
    }
}