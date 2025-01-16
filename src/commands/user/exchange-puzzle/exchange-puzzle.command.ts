import ICommand from "src/common/app/command.i";
import ExchangePuzzleParam from "./exchange-puzzle.param";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import { DomainError } from "src/common/error/domain.error";
import { UserExchangePrizeValueObject } from "src/domain/common/vo/user-exchange-prize";
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosError } from "axios";

@Injectable()
export default class ExchangePuzzleCommand implements ICommand<ExchangePuzzleParam> {
    constructor(
        private readonly uow: IUnitOfWork,
        private readonly httpService: HttpService,
    ) { }

    async execute(param: ExchangePuzzleParam): Promise<void> {
        const { userId, gameOfEventId } = param;
        const puzzleGame = await this.uow.puzzleGameRepository.getById(gameOfEventId);
        if (!puzzleGame) {
            throw new DomainError('Puzzle game not found');
        }
        const userPuzzle = await this.uow.userPuzzleRepository.getByUnique(userId, gameOfEventId);
        if (!userPuzzle) {
            throw new DomainError('User puzzle not found');
        }
        userPuzzle.doExchange();
        const userDoExchangeValueObject = new UserExchangePrizeValueObject({
            date: new Date()
        });
        await this.uow.userPuzzleRepository.addDoExchange(userPuzzle, userDoExchangeValueObject);
        await this.uow.userPuzzleRepository.updateHasPuzzleAll(userPuzzle);

        // Send prize to user:
        const prizes = puzzleGame.props.prizes;
        for (const prize of prizes) {
            const promotionUrl = process.env.PROMOTION_URL;
            if (promotionUrl == null) {
                throw new DomainError("Is not set promotion url");
            }
            const assignEndpoint = `${promotionUrl}/promotion-unauth/assign`;
            for (let i = 0; i < prize.props.amount; i++) {
                try {
                    await this.httpService.axiosRef.post(assignEndpoint, {
                        userId: userId,
                        promotionId: +prize.props.promotionId,
                    });
                } catch (error) {
                    if (error instanceof AxiosError) {
                        throw new DomainError(error.message);
                    }
                }
            }
        }
    }
}