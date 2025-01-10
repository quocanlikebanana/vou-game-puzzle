import ICommand from "src/common/app/command.i";
import TradePuzzleParam from "./trade-puzzle.param";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import { DomainError } from "src/common/error/domain.error";
import { PuzzleAmountValueObject } from "src/domain/common/vo/puzzle-amount.vo";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class TradePuzzleCommand implements ICommand<TradePuzzleParam> {
    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) { }

    async execute(param: TradePuzzleParam): Promise<void> {
        const { gameOfEventId, giveUserId, takeUserId, order, amount } = param;
        const puzzleGame = await this.unitOfWork.puzzleGameRepository.getById(gameOfEventId);
        if (!puzzleGame) {
            throw new DomainError('Puzzle game not found');
        }
        if (puzzleGame.props.allowTrade == false) {
            throw new DomainError('Trade is not allowed');
        }
        const giveUserPuzzle = await this.unitOfWork.userPuzzleRepository.getByUnique(giveUserId, gameOfEventId);
        if (!giveUserPuzzle) {
            throw new DomainError('User to give puzzle not found');
        }
        const takeUserPuzzle = await this.unitOfWork.userPuzzleRepository.getByUnique(takeUserId, gameOfEventId);
        if (!takeUserPuzzle) {
            throw new DomainError('User to take puzzle not found');
        }
        const puzzleAmountValueObject = new PuzzleAmountValueObject({
            amount: amount,
            order: order
        });
        const givePuzzle = giveUserPuzzle.doGive(puzzleAmountValueObject);
        const takePuzzle = takeUserPuzzle.doTake(puzzleAmountValueObject);
        await this.unitOfWork.userPuzzleRepository.addTradePuzzle(giveUserPuzzle, givePuzzle.tradePuzzle);
        await this.unitOfWork.userPuzzleRepository.updateHasPuzzle(giveUserPuzzle, givePuzzle.hasPuzzle);
        await this.unitOfWork.userPuzzleRepository.addTradePuzzle(takeUserPuzzle, takePuzzle.tradePuzzle);
        await this.unitOfWork.userPuzzleRepository.updateHasPuzzle(takeUserPuzzle, takePuzzle.hasPuzzle);
    }
}