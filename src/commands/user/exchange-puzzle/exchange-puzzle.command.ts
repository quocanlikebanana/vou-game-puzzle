import ICommand from "src/common/app/command.i";
import ExchangePuzzleParam from "./exchange-puzzle.param";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import { DomainError } from "src/common/error/domain.error";
import { UserExchangePrizeValueObject } from "src/domain/common/vo/user-exchange-prize";

export default class ExchangePuzzleCommand implements ICommand<ExchangePuzzleParam> {
    constructor(
        private readonly uow: IUnitOfWork
    ) { }

    async execute(param: ExchangePuzzleParam): Promise<void> {
        const { userId, gameOfEventId } = param;
        const puzzleGame = await this.uow.puzzleGameRepository.getById(gameOfEventId);
        if (!puzzleGame) {
            throw new DomainError('Puzzle game not found');
        }
        const userPuzzle = await this.uow.userPuzzleRepository.getByUnique(userId, gameOfEventId);
        if (!userPuzzle) {
            throw new DomainError('User puzzle not found');
        }
        userPuzzle.doExchange(gameOfEventId);
        const userDoExchangeValueObject = new UserExchangePrizeValueObject({
            date: new Date()
        });
        await this.uow.userPuzzleRepository.addDoExchange(userPuzzle, userDoExchangeValueObject);
        await this.uow.userPuzzleRepository.updateHasPuzzleAll(userPuzzle);
    }
}