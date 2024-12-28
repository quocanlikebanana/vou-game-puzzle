import { UserPuzzleProps } from "../../user/user-puzzle.agg";

export interface UserPuzzleCreateDto extends Omit<UserPuzzleProps, "doExchanges" | "hasPuzzles" | "rollPuzzles" | "tradePuzzles"> {
    orders: number[];
}