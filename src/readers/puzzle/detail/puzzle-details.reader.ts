import IReader from "src/common/app/reader.i";
import PuzzleDetailParam from "./puzzle-detail.param";
import PuzzleDetailPresenter from "./puzzle-detail.presenter";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma.service";
import { DomainError } from "src/common/error/domain.error";

@Injectable()
export default class PuzzleDetailReader implements IReader<PuzzleDetailParam, PuzzleDetailPresenter> {
    constructor(
        protected readonly prismaService: PrismaService
    ) { }

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
        if (!res) {
            throw new DomainError('Puzzle Game not found');
        }
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