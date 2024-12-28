import { Exchange } from "@prisma/client";
import { Entity } from "src/common/domain/entity.i";
import { DomainError } from "src/common/error/domain.error";
import { PrizeValueObject } from "../common/vo/prize.vo";
import { PuzzleAmountValueObject } from "../common/vo/puzzle-amount.vo";
import { ExchangeCreateDto } from "../common/dto/exchange-create.dto";
import { generateUUID } from "src/common/utils/generator";

export interface ExchangeProps extends Omit<Exchange, "id"> {
    prizes: PrizeValueObject[];
    withPuzzles: PuzzleAmountValueObject[];
}

export class ExchangeEntity extends Entity<ExchangeProps> {
    public initValidate(): void {
        validateEmpty(this.props);
        validatePositive(this.props);
    }

    static create(createDto: ExchangeCreateDto): ExchangeEntity {
        const id = generateUUID();
        const prizes = createDto.prizes.map(prize => new PrizeValueObject(prize));
        const withPuzzles = createDto.withPuzzles.map(puzzle => new PuzzleAmountValueObject(puzzle));
        const exchangeProps: ExchangeProps = {
            ...createDto,
            prizes: prizes,
            withPuzzles: withPuzzles
        };
        const entity = new ExchangeEntity(exchangeProps, id);
        entity.initValidate();
        return entity;
    }
}

function validateEmpty(newProps: ExchangeProps) {
    if (newProps.prizes.length === 0) {
        throw new DomainError("Prizes must be provided and cannot be empty.");
    }
    if (newProps.withPuzzles.length == 0) {
        throw new DomainError("With puzzles must be provided and cannot be empty.");
    }
}

function validatePositive(newProps: ExchangeProps) {
    if (newProps.prizes.some(prize => prize.props.amount < 0)) {
        throw new DomainError("Prize amount must be greater than or equal to 0.");
    }
    if (newProps.withPuzzles.some(puzzle => puzzle.props.amount < 0)) {
        throw new DomainError("Puzzle amount must be greater than or equal to 0.");
    }
}