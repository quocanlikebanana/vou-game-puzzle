import { PuzzleGameAggregate } from "src/domain/puzzle/puzzle-game.agg";
import { IPuzzleGameRepository } from "src/domain/puzzle/puzzle-game.repo.i";
import { PrismaRepositoryBase } from "./prisma.repo.base";
import { PuzzleRateValueObject } from "src/domain/common/vo/puzzle-rate.vo";
import { PrizeValueObject } from "src/domain/common/vo/prize.vo";
import { PuzzleAmountValueObject } from "src/domain/common/vo/puzzle-amount.vo";
import { DomainError } from "src/common/error/domain.error";

export class PuzzleGameRepository extends PrismaRepositoryBase implements IPuzzleGameRepository {
    async getById(gameOfEventId: string): Promise<PuzzleGameAggregate> {
        const res = await this.prismaService.puzzleGame.findUnique({
            where: { gameOfEventId },
            include: {
                Prize: true,
                Puzzle: true
            }
        });
        if (!res) {
            throw new DomainError('Puzzle game not found');
        }
        const puzzleGameAggregate = new PuzzleGameAggregate({
            ...res,
            puzzles: res.Puzzle.map(puzzle => new PuzzleRateValueObject({
                order: puzzle.order,
                rate: puzzle.rate
            })),
            prizes: res.Prize.map(prize => new PrizeValueObject({
                promotionId: prize.promotionId,
                amount: prize.amount
            }))
        });
        return puzzleGameAggregate;
    }

    async create(aggregate: PuzzleGameAggregate): Promise<void> {
        const res = await this.prismaService.puzzleGame.create({
            data: {
                gameOfEventId: aggregate.props.gameOfEventId,
                sizeX: aggregate.props.sizeX,
                sizeY: aggregate.props.sizeY,
                puzzleImage: aggregate.props.puzzleImage,
                allowTrade: aggregate.props.allowTrade,
                Puzzle: {
                    create: aggregate.props.puzzles.map(puzzle => ({
                        order: puzzle.props.order,
                        rate: puzzle.props.rate
                    }))
                },
                Prize: {
                    create: aggregate.props.prizes.map(prize => ({
                        promotionId: prize.props.promotionId,
                        amount: prize.props.amount
                    }))
                }
            }
        });
    }

    async delete(gameOfEventId: string): Promise<void> {
        await this.prismaService.puzzleGame.delete({
            where: { gameOfEventId }
        });
    }
}