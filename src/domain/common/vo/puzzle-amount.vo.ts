import { ValueObject } from "src/common/domain/value-object.i";
import { DomainError } from "src/common/error/domain.error";

export class PuzzleAmountValueObject extends ValueObject<{
    order: number;
    amount: number;
}> {
    protected validate(props: { order: number; amount: number; }): void {
        if (props.amount < 0) {
            throw new DomainError("Amount must be greater than or equal to 0");
        }
    }
}