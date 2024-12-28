import ICommand from "src/common/app/command.i";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import JoinPuzzleParam from "./join-puzzle.param";
import { UserPuzzleAggregate } from "src/domain/user/user-puzzle.agg";
import { DomainError } from "src/common/error/domain.error";

export default class JoinPuzzleCommand implements ICommand<JoinPuzzleParam> {
    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) { }

    async execute(param: JoinPuzzleParam): Promise<void> {
        const { userId, gameOfEventId } = param;
        const game = await this.unitOfWork.puzzleGameRepository.getById(gameOfEventId);
        if (!game) {
            throw new DomainError('Game not found');
        }
        const orders = game.props.puzzles.map(p => p.props.order);
        const userPuzzle = UserPuzzleAggregate.create({
            userId,
            gameOfEventId,
            orders,
        });
        await this.unitOfWork.userPuzzleRepository.create(userPuzzle);
    }
}