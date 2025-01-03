import { UserPuzzle } from "@prisma/client";
import AggregateRoot from "src/common/domain/aggregate.i";
import { PuzzleAmountValueObject } from "../common/vo/puzzle-amount.vo";
import { PuzzleRollValueObject } from "../common/vo/puzzle-roll.vo";
import { UserExchangePrizeValueObject } from "../common/vo/user-exchange-prize";
import { UserPuzzleCreateDto } from "../common/dto/user-puzzle-create.dto";
import { DomainError } from "src/common/error/domain.error";
import { PuzzleTradeValueObject } from "../common/vo/puzzle-trade.vo";
import { generateUUID } from "src/common/utils/generator";

export interface UserPuzzleProps extends Omit<UserPuzzle, "id"> {
    doExchanges: UserExchangePrizeValueObject[];
    hasPuzzles: PuzzleAmountValueObject[];
    rollPuzzles: PuzzleRollValueObject[];
    tradePuzzles: PuzzleTradeValueObject[];
}

export class UserPuzzleAggregate extends AggregateRoot<UserPuzzleProps> {
    public initValidate(): void { }

    static create(userCreateDto: UserPuzzleCreateDto): UserPuzzleAggregate {
        const hasPuzzles = userCreateDto.orders.map(order => new PuzzleAmountValueObject({
            order,
            amount: 0
        }));
        const id = generateUUID();
        const agg = new UserPuzzleAggregate({
            ...userCreateDto,
            doExchanges: [],
            hasPuzzles: hasPuzzles,
            rollPuzzles: [],
            tradePuzzles: []
        }, id);
        agg.initValidate();
        return agg;
    }

    doRoll(order: number): PuzzleRollValueObject {
        const hasPuzzle = this.props.hasPuzzles.find(p => p.props.order === order);
        if (hasPuzzle == null) {
            throw new DomainError("Puzzle not found.");
        }
        else {
            hasPuzzle.props.amount += 1;
        }
        const now = new Date();
        const rollPuzzle = new PuzzleRollValueObject({
            order,
            date: now
        });
        this.props.rollPuzzles.push(rollPuzzle);
        return rollPuzzle;
    }

    doExchange(gameOfEventId: string): void {
        for (const puzzle of this.props.hasPuzzles) {
            if (puzzle.props.amount < 1) {
                throw new DomainError("Not enough puzzle.");
            }
            puzzle.props.amount -= 1;
        }
        const now = new Date();
        const userDoExchange = new UserExchangePrizeValueObject({
            date: now,
        });
        this.props.doExchanges.push(userDoExchange);
    }

    doGive(puzzleAmount: PuzzleAmountValueObject): {
        hasPuzzle: PuzzleAmountValueObject,
        tradePuzzle: PuzzleTradeValueObject
    } {
        const hasPuzzle = this.props.hasPuzzles.find(p => p.props.order === puzzleAmount.props.order);
        if (hasPuzzle == null) {
            throw new DomainError("Puzzle not found.");
        }
        if (hasPuzzle.props.amount < puzzleAmount.props.amount) {
            throw new DomainError("Not enough puzzle.");
        }
        hasPuzzle.props.amount -= puzzleAmount.props.amount;
        const now = new Date();
        const tradePuzzle = new PuzzleTradeValueObject({
            order: puzzleAmount.props.order,
            amount: puzzleAmount.props.amount * -1,
            date: now
        });
        this.props.tradePuzzles.push(tradePuzzle);
        return { hasPuzzle, tradePuzzle };
    }

    doTake(puzzleAmount: PuzzleAmountValueObject): {
        hasPuzzle: PuzzleAmountValueObject,
        tradePuzzle: PuzzleTradeValueObject
    } {
        const hasPuzzle = this.props.hasPuzzles.find(p => p.props.order === puzzleAmount.props.order);
        if (hasPuzzle == null) {
            throw new DomainError("Puzzle not found.");
        }
        hasPuzzle.props.amount += puzzleAmount.props.amount;
        const now = new Date();
        const tradePuzzle = new PuzzleTradeValueObject({
            order: puzzleAmount.props.order,
            amount: puzzleAmount.props.amount,
            date: now
        });
        this.props.tradePuzzles.push(tradePuzzle);
        return { hasPuzzle, tradePuzzle };
    }
}