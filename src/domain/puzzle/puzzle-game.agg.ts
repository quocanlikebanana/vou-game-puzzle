import { PuzzleGame } from "@prisma/client";
import AggregateRoot from "src/common/domain/aggregate.i";
import { DomainError } from "src/common/error/domain.error";
import { PuzzleRateValueObject } from "../common/vo/puzzle-rate.vo";
import { PuzzleGameCreateDto } from "../common/dto/puzzle-game-create.dto";
import { PrizeValueObject } from "../common/vo/prize.vo";

export interface PuzzleGameProps extends PuzzleGame {
    puzzles: PuzzleRateValueObject[];
    prizes: PrizeValueObject[];
}

export class PuzzleGameAggregate extends AggregateRoot<PuzzleGameProps> {
    constructor(props: PuzzleGameProps) {
        super(props, props.gameOfEventId);
    }

    public initValidate(): void {
        validatePuzzleGame(this.props);
        validatePuzzles(this.props);
        validatePrizes(this.props);
    }

    static create(createDto: PuzzleGameCreateDto): PuzzleGameAggregate {
        const puzzles = createDto.puzzles.map(puzzle => new PuzzleRateValueObject(puzzle));
        const prizes = createDto.prizes.map(prize => new PrizeValueObject(prize));
        const agg = new PuzzleGameAggregate({
            ...createDto,
            puzzles,
            prizes
        });
        agg.initValidate();
        return agg;
    }

    rollPuzzle(): { order: number } {
        const totalRate = this.props.puzzles.reduce((sum, puzzle) => sum + puzzle.props.rate, 0);
        const randomRate = Math.random() * totalRate;
        let range = 0;
        for (const puzzle of this.props.puzzles) {
            const preRange = range;
            range += puzzle.props.rate;
            if (preRange <= randomRate && randomRate <= range) {
                return { order: puzzle.props.order };
            }
        }
        throw new DomainError("Failed to roll a puzzle.");
    }
}

function validatePuzzleGame(newProps: PuzzleGameProps) {
    if (newProps.sizeX < 1 || newProps.sizeY < 1) {
        throw new DomainError("Puzzle size must be greater than 0.");
    }
}

function validatePuzzles(newProps: PuzzleGameProps) {
    if (newProps.puzzles.length === 0) {
        throw new DomainError("Puzzles must be provided and cannot be empty.");
    }
    if (newProps.puzzles.some(puzzle => puzzle.props.rate < 0)) {
        throw new DomainError("Puzzle order and rate must be greater than or equal to 0.");
    }
    const orders = newProps.puzzles.map(puzzle => puzzle.props.order);
    if (orders.length !== newProps.sizeX * newProps.sizeY) {
        throw new DomainError("Puzzles must be a matrix of size X * size Y.");
    }
    const sortedOrders = [...orders].sort((a, b) => a - b);
    for (let i = 0; i < sortedOrders.length; i++) {
        if (sortedOrders[i] !== i) {
            throw new DomainError("Puzzle orders must be a sequence of ascending distinct numbers starting from 0.");
        }
    }
}

function validatePrizes(newProps: PuzzleGameProps) {
    if (newProps.prizes.length == 0) {
        throw new DomainError("Prizes must be provided and cannot be empty.");
    }
    if (newProps.prizes.some(prize => prize.props.amount < 0)) {
        throw new DomainError("Prize amount must be greater than or equal to 0.");
    }
}
