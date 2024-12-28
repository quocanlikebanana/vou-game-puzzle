import { PuzzleGameAggregate } from "./puzzle-game.agg";

export abstract class IPuzzleGameRepository {
    abstract getById(gameOfEventId: string): Promise<PuzzleGameAggregate>;
    abstract create(aggregate: PuzzleGameAggregate): Promise<void>;
    abstract delete(gameOfEventId: string): Promise<void>;
}