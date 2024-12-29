import IReader from "src/common/app/reader.i";
import PuzzleDetailParam from "./puzzle-detail.param";
import PuzzleDetailPresenter from "./puzzle-detail.presenter";
import { PrismaService } from "src/infra/prisma.service";
import PrismaReaderBase from "src/readers/prisma.reader.base";

export default class PuzzleDetailReader extends PrismaReaderBase implements IReader<PuzzleDetailParam, PuzzleDetailPresenter> {
    async read(param: PuzzleDetailParam): Promise<PuzzleDetailPresenter> {
        const { gameOfEventId } = param;
        const res = await this.prismaService.puzzleGame.findUnique({
            where: {
                gameOfEventId
            },
            include: {
                Puzzle: true,
                Prize: true,
            }
        });
        const presenter: PuzzleDetailPresenter = {
            gameOfEventId: res.gameOfEventId,
            sizeX: res.sizeX,
            sizeY: res.sizeY,
            puzzleImage: res.puzzleImage,
            allowTrade: res.allowTrade,
            puzzles: res.Puzzle.map(p => ({
                order: p.order,
                rate: p.rate,
            })),
            prizes: res.Prize.map(p => ({
                promotionId: p.promotionId,
                amount: p.amount,
            })),
        };
        return presenter;
    }
}