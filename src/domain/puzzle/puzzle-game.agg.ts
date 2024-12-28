import { PuzzleGame } from "@prisma/client";
import AggregateRoot from "src/common/domain/aggregate.i";
import { DomainError } from "src/common/error/domain.error";
import { ExchangeEntity } from "./exchange.entity";
import { PuzzleRateValueObject } from "../common/vo/puzzle-rate.vo";
import { PuzzleGameCreateDto } from "../common/dto/puzzle-game-create.dto";
import { PrizeValueObject } from "../common/vo/prize.vo";

export interface PuzzleGameProps extends PuzzleGame {
    puzzles: PuzzleRateValueObject[];
    exchanges: ExchangeEntity[];
}

export class PuzzleGameAggregate extends AggregateRoot<PuzzleGameProps> {
    constructor(props: PuzzleGameProps) {
        super(props, props.gameOfEventId);
    }

    public initValidate(): void {
        validateEmpty(this.props);
        validatePositive(this.props);
        validatePuzzleOrders(this.props);
        validateExchange(this.props);
    }

    static create(createDto: PuzzleGameCreateDto): PuzzleGameAggregate {
        const puzzles = createDto.puzzles.map(puzzle => new PuzzleRateValueObject(puzzle));
        const exchangeEntities = createDto.exchanges.map(exchange => ExchangeEntity.create({
            ...exchange,
            gameOfEventId: createDto.gameOfEventId
        }));
        const agg = new PuzzleGameAggregate({
            ...createDto,
            puzzles: puzzles,
            exchanges: exchangeEntities
        });
        agg.initValidate();
        return agg;
    }

    getRoll(): { order: number } {
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

    getExchange(exchangeId?: string): ExchangeEntity {
        if (exchangeId == null) {
            if (this.props.exchanges.length === 0) {
                throw new DomainError("There's no prize for the puzzle.");
            }
            return this.props.exchanges[0];
        }
        const exchange = this.props.exchanges.find(exchange => exchange.id === exchangeId);
        if (exchange == null) {
            throw new DomainError("Exchange not found.");
        }
        return exchange;
    }
}

function validateEmpty(newProps: PuzzleGameProps) {
    if (newProps.puzzles.length === 0) {
        throw new DomainError("Puzzles must be provided and cannot be empty.");
    }
    if (newProps.exchanges.length == 0) {
        throw new DomainError("Exchanges must be provided and cannot be empty.");
    }
}

function validatePositive(newProps: PuzzleGameProps) {
    if (newProps.sizeX < 1 || newProps.sizeY < 1) {
        throw new DomainError("Puzzle size must be greater than 0.");
    }
    if (newProps.puzzles.some(puzzle => puzzle.props.rate < 0)) {
        throw new DomainError("Puzzle order and rate must be greater than or equal to 0.");
    }
}

function validatePuzzleOrders(newProps: PuzzleGameProps) {
    const orders = newProps.puzzles.map(puzzle => puzzle.props.order);
    const sortedOrders = [...orders].sort((a, b) => a - b);
    for (let i = 0; i < sortedOrders.length; i++) {
        if (sortedOrders[i] !== i) {
            throw new DomainError("Puzzle orders must be a sequence of ascending distinct numbers starting from 0.");
        }
    }
    if (orders.length !== newProps.sizeX * newProps.sizeY) {
        throw new DomainError("Puzzles must be a matrix of size X * size Y.");
    }
    newProps.exchanges.forEach(exchange => {
        exchange.props.withPuzzles.forEach(withPuzzle => {
            if (!orders.includes(withPuzzle.props.order)) {
                throw new DomainError("Exchange with Puzzles must refer to a valid puzzle order.");
            }
        });
    });
}

function validateExchange(props: PuzzleGameProps) {
    props.exchanges.forEach(exchange => {
        exchange.initValidate();
    });
}
