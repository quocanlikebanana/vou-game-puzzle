import { ValueObject } from "src/common/domain/value-object.i";
import { DomainError } from "src/common/error/domain.error";

export class PrizeValueObject extends ValueObject<{
    promotionId: string;
    amount: number;
}> {
    protected validate(props: { promotionId: string; amount: number; }): void {
        if (props.amount <= 0) {
            throw new DomainError("Amount must be greater than 0");
        }
    }
}