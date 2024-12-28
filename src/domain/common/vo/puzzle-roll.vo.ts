import { ValueObject } from "src/common/domain/value-object.i";
import { DomainError } from "src/common/error/domain.error";

export class PuzzleRollValueObject extends ValueObject<{
    order: number;
    date: Date;
}> {
    protected validate(props: { order: number; amount: number; date: Date; }): void {
        if (props.amount <= 0) {
            throw new DomainError("Amount must be greater than 0.");
        }
    }
}