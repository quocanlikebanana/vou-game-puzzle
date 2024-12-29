import IReader from "src/common/app/reader.i";
import ExchangeHistoryParam from "./exchange-history.param";
import ExchangeHistoryPresenter from "./exchange-history.presenter";
import PrismaReaderBase from "src/readers/prisma.reader.base";

export default class ExchangeHistoryReader extends PrismaReaderBase implements IReader<ExchangeHistoryParam, ExchangeHistoryPresenter[]> {
    async read(param: ExchangeHistoryParam): Promise<ExchangeHistoryPresenter[]> {
        const { userId, gameOfEventId } = param;
        const res = await this.prismaService.user_Exchange_Prize.findMany({
            where: {
                UserPuzzle: {
                    userId,
                    gameOfEventId
                }
            },
        });
        const presenter: ExchangeHistoryPresenter[] = res.map(r => {
            return {
                date: r.date
            };
        });
        return presenter;
    }
}