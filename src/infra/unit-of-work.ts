import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import { PrismaService } from "./prisma.service";
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { IPuzzleGameRepository } from "src/domain/puzzle/puzzle-game.repo.i";
import { IUserPuzzleRepository } from "src/domain/user/user-puzzle.repo.i";
import { PuzzleGameRepository } from "./repositories/puzzle-game.repo";
import { UserPuzzleRepository } from "./repositories/user-puzzle.repo";

@Injectable()
export class UnitOfWork implements IUnitOfWork, OnModuleDestroy {
    public readonly puzzleGameRepository: IPuzzleGameRepository;
    public readonly userPuzzleRepository: IUserPuzzleRepository;

    constructor(
        private readonly prismaService: PrismaService
    ) {
        this.puzzleGameRepository = new PuzzleGameRepository(prismaService);
        this.userPuzzleRepository = new UserPuzzleRepository(prismaService);
    }

    /**
     * Executes a function within a (iterative) transaction.
     */
    async executeTransaction<T>(fn: (tx: UnitOfWork) => Promise<T>): Promise<T> {
        return this.prismaService.$transaction(async (tx) => {
            const uow = new UnitOfWork(this.prismaService);
            uow.prismaService.$connect();
            return fn(uow);
        });
    }

    async onModuleDestroy() {
        await this.prismaService.$disconnect();
    }
}