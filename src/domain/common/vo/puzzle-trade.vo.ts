import { ValueObject } from "src/common/domain/value-object.i";

export class PuzzleTradeValueObject extends ValueObject<{
    order: number;
    amount: number;
    date: Date;
}> {
    private _isGiven: boolean;
    protected validate(props: { order: number; amount: number; date: Date; }): void {
        if (props.amount <= 0) {
            this._isGiven = true;
        }
        else {
            this._isGiven = false;
        }
    }
    public get isGiven(): boolean {
        return this._isGiven;
    }
}