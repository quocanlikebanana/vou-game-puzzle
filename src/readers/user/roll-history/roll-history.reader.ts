import IReader from "src/common/app/reader.i";
import PrismaReaderBase from "src/readers/prisma.reader.base";
import RollHistoryParam from "./roll-history.param";
import RollHistoryPresenter from "./roll-history.presenter";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class RollHistoryReader extends PrismaReaderBase implements IReader<RollHistoryParam, RollHistoryPresenter[]> {
    async read(param: RollHistoryParam): Promise<RollHistoryPresenter[]> {
        const { userId, gameOfEventId } = param;

        const query = await this.prismaService.user_Roll_Puzzle.findMany({
            where: {
                UserPuzzle: {
                    userId: userId,
                    gameOfEventId: gameOfEventId
                }
            },
            include: {
                Puzzle: true,
            },
            orderBy: {
                date: "desc"
            }
        });

        const presenters: RollHistoryPresenter[] = query.map(rollHistory => {
            return {
                order: rollHistory.Puzzle.order,
                date: rollHistory.date
            };
        });
        return presenters;
    }
}