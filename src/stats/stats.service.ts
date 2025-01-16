import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma.service';

@Injectable()
export class StatsService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getUsersCountOfAll() {
        return this.prismaService.userPuzzle.count();
    }

    async getUsersCountOfGame(gameOfEventId: string) {
        return this.prismaService.userPuzzle.count({
            where: {
                gameOfEventId: gameOfEventId
            }
        });
    }

    async getPrizeGivenCountOfGame(gameOfEventId: string) {
        const amount = await this.prismaService.user_Exchange_Prize.count({
            where: {
                UserPuzzle: {
                    gameOfEventId
                }
            }
        });
        const prizes = await this.prismaService.prize.findMany({
            where: {
                gameOfEventId
            }
        });
        return {
            gameOfEventId,
            given: amount,
            prizes: prizes
        }
    }
}
