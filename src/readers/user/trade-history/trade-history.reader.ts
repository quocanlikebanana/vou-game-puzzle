import IReader from "src/common/app/reader.i";
import PrismaReaderBase from "src/readers/prisma.reader.base";
import TradeHistoryParam from "./trade-history.param";
import TradeHistoryPresenter from "./trade-history.presenter";

export default class TradeHistoryReader extends PrismaReaderBase implements IReader<TradeHistoryParam, TradeHistoryPresenter[]> {
    async read(param: TradeHistoryParam): Promise<TradeHistoryPresenter[]> {
        const { userId, gameOfEventId } = param;

        const query = await this.prismaService.user_Trade_Puzzle.findMany({
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

        const presenters: TradeHistoryPresenter[] = query.map(tradeHistory => {
            return {
                order: tradeHistory.Puzzle.order,
                amount: tradeHistory.amount,
                date: tradeHistory.date
            };
        });
        return presenters;
    }
}