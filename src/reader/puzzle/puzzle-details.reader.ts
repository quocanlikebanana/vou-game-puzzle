import IReader from "src/common/app/reader.i";
import PuzzleDetailParam from "./puzzle-detail.param";
import PuzzleDetailPresenter from "./puzzle-detail.presenter";
import { PrismaService } from "src/infra/prisma.service";

export default class PuzzleDetailReader implements IReader<PuzzleDetailParam, PuzzleDetailPresenter> {
    constructor(
        private readonly prismaService: PrismaService,
    ) { }

    async read(param: PuzzleDetailParam): Promise<PuzzleDetailPresenter> {

    }
}