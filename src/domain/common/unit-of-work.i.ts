import { IPuzzleGameRepository } from "../puzzle/puzzle-game.repo.i";
import { IUserPuzzleRepository } from "../user/user-puzzle.repo.i";

export abstract class IUnitOfWork {
    abstract get puzzleGameRepository(): IPuzzleGameRepository;
    abstract get userPuzzleRepository(): IUserPuzzleRepository;

    /**
     * Executes a function within a (iterative) transaction.
     * NOTE: Do note open the "gate" for too long, for example: send emails, notifications, .... (That's why it is called in each execute method, not at an common abstract method)
     */
    abstract executeTransaction<T>(fn: (uow: IUnitOfWork) => Promise<T>): Promise<T>;
}