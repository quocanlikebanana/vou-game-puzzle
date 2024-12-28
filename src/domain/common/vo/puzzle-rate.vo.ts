import { ValueObject } from "src/common/domain/value-object.i";
import { DomainError } from "src/common/error/domain.error";

export class PuzzleRateValueObject extends ValueObject<{
    order: number;
    rate: number;
}> {
    protected validate(props: { order: number; rate: number; }): void {
        if (props.rate < 0) {
            throw new DomainError("Puzzle order and rate must be greater than or equal to 0.");
        }
    }
}