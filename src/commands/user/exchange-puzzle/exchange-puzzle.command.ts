import ICommand from "src/common/app/command.i";
import ExchangePuzzleParam from "./exchange-puzzle.param";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import { DomainError } from "src/common/error/domain.error";
import { UserDoExchangeValueObject } from "src/domain/common/vo/user-do-exchange.vo";

export default class ExchangePuzzleCommand implements ICommand<ExchangePuzzleParam, boolean> {
    constructor(
        private readonly uow: IUnitOfWork
    ) { }

    async execute(param: ExchangePuzzleParam): Promise<boolean> {
        const { userId, gameOfEventId } = param;
        const puzzleGame = await this.uow.puzzleGameRepository.getById(gameOfEventId);
        if (!puzzleGame) {
            throw new DomainError('Puzzle game not found');
        }
        const userPuzzle = await this.uow.userPuzzleRepository.getByUnique(userId, gameOfEventId);
        if (!userPuzzle) {
            throw new DomainError('User puzzle not found');
        }
        const exchange = puzzleGame.getExchange();
        const exchangeRes = userPuzzle.doExchange(exchange.id, exchange.props.withPuzzles);
        if (!exchangeRes) {
            return false;
        }
        const userDoExchangeValueObject = new UserDoExchangeValueObject({
            exchangeId: exchange.id,
            date: new Date()
        });
        await this.uow.userPuzzleRepository.addDoExchange(userPuzzle, userDoExchangeValueObject);
        await this.uow.userPuzzleRepository.updateHasPuzzleAll(userPuzzle);
        return true;
    }
}