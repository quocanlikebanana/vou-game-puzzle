import { ValueObject } from "src/common/domain/value-object.i";

export interface UserExchangePrizeProps {
    date: Date;
};

export class UserExchangePrizeValueObject extends ValueObject<UserExchangePrizeProps> {
    protected validate(props: UserExchangePrizeProps): void { }
}