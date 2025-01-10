import IReader from "src/common/app/reader.i";
import GetUserPuzzlesParam from "./get-user-puzzles.param";
import GetUserPuzzlesPresenter from "./get-user-puzzles.presenter";
import PrismaReaderBase from "src/readers/prisma.reader.base";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class GetUserPuzzlesReader extends PrismaReaderBase implements IReader<GetUserPuzzlesParam, GetUserPuzzlesPresenter[]> {
    async read(param: GetUserPuzzlesParam): Promise<GetUserPuzzlesPresenter[]> {
        const { userId, gameOfEventId } = param;
        const puzzles = await this.prismaService.user_Has_Puzzle.findMany({
            where: {
                UserPuzzle: {
                    userId,
                    gameOfEventId
                },
                Puzzle: {
                    gameOfEventId
                }
            },
            include: {
                Puzzle: true,
            }
        });
        const presenters: GetUserPuzzlesPresenter[] = puzzles.map(puzzle => {
            return {
                order: puzzle.Puzzle.order,
                amount: puzzle.amount
            };
        });
        return presenters;
    }
}