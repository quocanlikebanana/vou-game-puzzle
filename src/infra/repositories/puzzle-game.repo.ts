import { PuzzleGameAggregate } from "src/domain/puzzle/puzzle-game.agg";
import { IPuzzleGameRepository } from "src/domain/puzzle/puzzle-game.repo.i";
import { PrismaRepositoryBase } from "./prisma.repo.base";
import { PuzzleRateValueObject } from "src/domain/common/vo/puzzle-rate.vo";
import { ExchangeEntity } from "src/domain/puzzle/exchange.entity";
import { PrizeValueObject } from "src/domain/common/vo/prize.vo";
import { PuzzleAmountValueObject } from "src/domain/common/vo/puzzle-amount.vo";

export class PuzzleGameRepository extends PrismaRepositoryBase implements IPuzzleGameRepository {
    async getById(gameOfEventId: string): Promise<PuzzleGameAggregate> {
        const res = await this.prismaService.puzzleGame.findUnique({
            where: { gameOfEventId },
            include: {
                Exchange: {
                    include: {
                        Exchange_Prize: true,
                        Exchange_With_Puzzle: {
                            include: {
                                Puzzle: true
                            }
                        }
                    },
                },
                Puzzle: true
            }
        });
        const puzzleGameAggregate = new PuzzleGameAggregate({
            ...res,
            puzzles: res.Puzzle.map(puzzle => new PuzzleRateValueObject({
                order: puzzle.order,
                rate: puzzle.rate
            })),
            exchanges: res.Exchange.map(exchange => new ExchangeEntity({
                ...exchange,
                prizes: exchange.Exchange_Prize.map(prize => new PrizeValueObject({ promotionId: prize.promotionId, amount: prize.amount })),
                withPuzzles: exchange.Exchange_With_Puzzle.map(exchangePuzzle => new PuzzleAmountValueObject({ order: exchangePuzzle.Puzzle.order, amount: exchangePuzzle.amount }))
            }, exchange.id))
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
                Exchange: {
                    create: aggregate.props.exchanges.map(exchange => ({
                        id: exchange.id,
                        gameOfEventId: aggregate.props.gameOfEventId,
                        Exchange_Prize: {
                            create: exchange.props.prizes.map(prize => ({
                                promotionId: prize.props.promotionId,
                                amount: prize.props.amount
                            }))
                        },
                        Exchange_With_Puzzle: {
                            create: exchange.props.withPuzzles.map(puzzle => ({
                                Puzzle: {
                                    connect: {
                                        gameOfEventId: aggregate.props.gameOfEventId,
                                        order: puzzle.props.order
                                    },
                                },
                                amount: puzzle.props.amount
                            }))
                        }
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