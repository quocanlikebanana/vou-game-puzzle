import { UserPuzzleAggregate } from "src/domain/user/user-puzzle.agg";
import { IUserPuzzleRepository } from "src/domain/user/user-puzzle.repo.i";
import { PrismaRepositoryBase } from "./prisma.repo.base";
import { UserExchangePrizeValueObject } from "src/domain/common/vo/user-exchange-prize";
import { PuzzleAmountValueObject } from "src/domain/common/vo/puzzle-amount.vo";
import { PuzzleRollValueObject } from "src/domain/common/vo/puzzle-roll.vo";
import { PuzzleTradeValueObject } from "src/domain/common/vo/puzzle-trade.vo";
import { DomainError } from "src/common/error/domain.error";

export class UserPuzzleRepository extends PrismaRepositoryBase implements IUserPuzzleRepository {
    async getById(userPuzzleId: string): Promise<UserPuzzleAggregate> {
        const res = await this.prismaService.userPuzzle.findUnique({
            where: { id: userPuzzleId },
            include: {
                User_Exchange_Prize: true,
                User_Has_Puzzle: {
                    include: {
                        Puzzle: true
                    }
                },
                User_Roll_Puzzle: {
                    include: {
                        Puzzle: true
                    }
                },
                User_Trade_Puzzle: {
                    include: {
                        Puzzle: true
                    }
                }
            }
        });
        return mapUserPuzzleDataToAggregate(res);
    }

    async getByUnique(userId: string, gameOfEventId: string): Promise<UserPuzzleAggregate> {
        const res = await this.prismaService.userPuzzle.findUnique({
            where: { userId_gameOfEventId: { userId, gameOfEventId } },
            include: {
                User_Exchange_Prize: true,
                User_Has_Puzzle: {
                    include: {
                        Puzzle: true
                    }
                },
                User_Roll_Puzzle: {
                    include: {
                        Puzzle: true
                    }
                },
                User_Trade_Puzzle: {
                    include: {
                        Puzzle: true
                    }
                }
            }
        });
        return mapUserPuzzleDataToAggregate(res);
    }

    async create(aggregate: UserPuzzleAggregate): Promise<{ id: string }> {
        const res = await this.prismaService.userPuzzle.create({
            data: {
                id: aggregate.id,
                userId: aggregate.props.userId,
                gameOfEventId: aggregate.props.gameOfEventId,
                User_Has_Puzzle: {
                    create: aggregate.props.hasPuzzles.map(p => ({
                        Puzzle: {
                            connect: {
                                gameOfEventId_order: {
                                    gameOfEventId: aggregate.props.gameOfEventId,
                                    order: p.props.order
                                }
                            }
                        },
                        amount: p.props.amount
                    }))
                }
            }
        });
        return { id: res.id };
    }

    async updateHasPuzzle(aggregate: UserPuzzleAggregate, puzzleAmount: PuzzleAmountValueObject): Promise<void> {
        const puzzle = await this.prismaService.puzzle.findUnique({
            where: {
                gameOfEventId_order: {
                    gameOfEventId: aggregate.props.gameOfEventId,
                    order: puzzleAmount.props.order
                }
            }
        });
        if (puzzle == null) {
            throw new DomainError("Puzzle not found.");
        }
        await this.prismaService.user_Has_Puzzle.update({
            where: {
                userPuzzleId_puzzleId: {
                    userPuzzleId: aggregate.id,
                    puzzleId: puzzle.id
                }
            },
            data: {
                amount: puzzleAmount.props.amount
            }
        });
    }

    async updateHasPuzzleAll(aggregate: UserPuzzleAggregate): Promise<void> {
        this.prismaService.$transaction(async (ctx) => {
            await ctx.user_Has_Puzzle.deleteMany({
                where: {
                    Puzzle: {
                        gameOfEventId: aggregate.props.gameOfEventId
                    },
                    userPuzzleId: aggregate.id
                },
            });
            for (const element of aggregate.props.hasPuzzles) {
                const puzzle = await ctx.puzzle.findUnique({
                    where: {
                        gameOfEventId_order: {
                            gameOfEventId: aggregate.props.gameOfEventId,
                            order: element.props.order
                        }
                    }
                });
                if (puzzle == null) {
                    throw new DomainError("Puzzle not found.");
                }
                await ctx.user_Has_Puzzle.create({
                    data: {
                        userPuzzleId: aggregate.id,
                        puzzleId: puzzle.id,
                        amount: element.props.amount
                    }
                });
            }
        });
    }

    async addRollPuzzle(aggregate: UserPuzzleAggregate, roll: PuzzleRollValueObject): Promise<void> {
        const puzzle = await this.prismaService.puzzle.findUnique({
            where: {
                gameOfEventId_order: {
                    gameOfEventId: aggregate.props.gameOfEventId,
                    order: roll.props.order
                }
            }
        });
        if (puzzle == null) {
            throw new DomainError("Puzzle not found.");
        }
        await this.prismaService.user_Roll_Puzzle.create({
            data: {
                userPuzzleId: aggregate.id,
                puzzleId: puzzle.id,
                date: roll.props.date
            }
        });
    }

    async addTradePuzzle(aggregate: UserPuzzleAggregate, trade: PuzzleTradeValueObject): Promise<void> {
        const puzzle = await this.prismaService.puzzle.findUnique({
            where: {
                gameOfEventId_order: {
                    gameOfEventId: aggregate.props.gameOfEventId,
                    order: trade.props.order
                }
            }
        });
        if (puzzle == null) {
            throw new DomainError("Puzzle not found.");
        }
        await this.prismaService.user_Trade_Puzzle.create({
            data: {
                userPuzzleId: aggregate.id,
                puzzleId: puzzle.id,
                amount: trade.props.amount,
                date: trade.props.date
            }
        });
    }

    async addDoExchange(aggregate: UserPuzzleAggregate, doExchange: UserExchangePrizeValueObject): Promise<void> {
        await this.prismaService.user_Exchange_Prize.create({
            data: {
                userPuzzleId: aggregate.id,
                date: doExchange.props.date
            }
        });
    }

    async delete(userPuzzleId: string): Promise<void> {
        await this.prismaService.userPuzzle.delete({
            where: {
                id: userPuzzleId
            }
        });
    }
}

function mapUserPuzzleDataToAggregate(res: {
    User_Has_Puzzle: ({
        Puzzle: {
            id: string;
            gameOfEventId: string;
            order: number;
            rate: number;
        };
    } & {
        userPuzzleId: string;
        puzzleId: string;
        amount: number;
    })[];
    User_Roll_Puzzle: ({
        Puzzle: {
            id: string;
            gameOfEventId: string;
            order: number;
            rate: number;
        };
    } & {
        userPuzzleId: string;
        date: Date;
        puzzleId: string;
    })[];
    User_Exchange_Prize: {
        date: Date;
    }[];
    User_Trade_Puzzle: ({
        Puzzle: {
            id: string;
            gameOfEventId: string;
            order: number;
            rate: number;
        };
    } & {
        userPuzzleId: string;
        date: Date;
        puzzleId: string;
        amount: number;
    })[];
} & {
    id: string;
    userId: string;
    gameOfEventId: string;
}) {
    const userPuzzleAggregate = new UserPuzzleAggregate({
        ...res,
        doExchanges: res.User_Exchange_Prize.map(e => new UserExchangePrizeValueObject({
            date: e.date,
        })),
        hasPuzzles: res.User_Has_Puzzle.map(p => new PuzzleAmountValueObject({
            order: p.Puzzle.order,
            amount: p.amount
        })),
        rollPuzzles: res.User_Roll_Puzzle.map(p => new PuzzleRollValueObject({
            order: p.Puzzle.order,
            date: p.date
        })),
        tradePuzzles: res.User_Trade_Puzzle.map(p => new PuzzleTradeValueObject({
            order: p.Puzzle.order,
            amount: p.amount,
            date: p.date
        }))
    }, res.id);
    return userPuzzleAggregate;
}
