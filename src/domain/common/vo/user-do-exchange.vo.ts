import { ValueObject } from "src/common/domain/value-object.i";

export interface UserDoExchangeProps {
    exchangeId: string;
    date: Date;
};

export class UserDoExchangeValueObject extends ValueObject<UserDoExchangeProps> {
    protected validate(props: UserDoExchangeProps): void { }
}