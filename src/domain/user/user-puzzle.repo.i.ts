import { PuzzleAmountValueObject } from "../common/vo/puzzle-amount.vo";
import { PuzzleRollValueObject } from "../common/vo/puzzle-roll.vo";
import { PuzzleTradeValueObject } from "../common/vo/puzzle-trade.vo";
import { UserDoExchangeValueObject } from "../common/vo/user-do-exchange.vo";
import { UserPuzzleAggregate } from "./user-puzzle.agg";

export abstract class IUserPuzzleRepository {
    abstract getById(userPuzzleId: string): Promise<UserPuzzleAggregate>;
    abstract getByUnique(userId: string, gameOfEventId: string): Promise<UserPuzzleAggregate>;
    abstract create(aggregate: UserPuzzleAggregate): Promise<{ id: string }>;
    abstract updateHasPuzzle(aggregate: UserPuzzleAggregate, puzzleAmount: PuzzleAmountValueObject): Promise<void>;
    abstract updateHasPuzzleAll(aggregate: UserPuzzleAggregate): Promise<void>;
    abstract addRollPuzzle(aggregate: UserPuzzleAggregate, roll: PuzzleRollValueObject): Promise<void>;
    abstract addTradePuzzle(aggregate: UserPuzzleAggregate, trade: PuzzleTradeValueObject): Promise<void>;
    abstract addDoExchange(aggregate: UserPuzzleAggregate, doExchange: UserDoExchangeValueObject): Promise<void>;
    abstract delete(userPuzzleId: string): Promise<void>;
}