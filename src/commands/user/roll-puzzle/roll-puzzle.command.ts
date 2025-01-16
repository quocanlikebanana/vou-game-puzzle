import ICommand from "src/common/app/command.i";
import RollPuzzleParam from "./roll-puzzle.param";
import { IUnitOfWork } from "src/domain/common/unit-of-work.i";
import { PuzzleAmountValueObject } from "src/domain/common/vo/puzzle-amount.vo";
import { DomainError } from "src/common/error/domain.error";
import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AxiosError } from "axios";

@Injectable()
export default class RollPuzzleCommand implements ICommand<RollPuzzleParam> {
    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly httpService: HttpService
    ) { }

    async execute(param: RollPuzzleParam): Promise<void> {
        const { userId, gameOfEventId } = param;
        const puzzleGame = await this.unitOfWork.puzzleGameRepository.getById(gameOfEventId);
        if (!puzzleGame) {
            throw new DomainError('Puzzle game not found');
        }
        const userPuzzle = await this.unitOfWork.userPuzzleRepository.getByUnique(userId, gameOfEventId);
        if (!userPuzzle) {
            throw new DomainError('User puzzle not found');
        }

        // Reduce turn on Event server
        const eventUrl = process.env.EVENT_URL;
        if (!eventUrl) {
            throw new DomainError('Is not connected to event');
        }
        try {
            const gameUrl = process.env.GAME_URL;
            if (!gameUrl) {
                throw new DomainError('Is not set game url');
            }
            const gameEndpoint = `${gameUrl}/game-event/unauth/detail/${gameOfEventId}`;
            const gameInfo = await this.httpService.axiosRef.get(gameEndpoint);
            console.log(gameInfo);
            if (!gameInfo.data || gameInfo.data.eventId == null) {
                throw new DomainError('Game not found');
            }
            const eventId = gameInfo.data.eventId;
            const body = { userId, eventId, turn: 1 };
            const eventEndpoint = `${eventUrl}/system/reduce-turn`;
            console.log(`Send request: `, eventEndpoint, body);
            await this.httpService.axiosRef.post(eventEndpoint, body);
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new DomainError(error.message);
            }
        }

        const order = puzzleGame.rollPuzzle().order;
        const puzzleRollValueObject = userPuzzle.doRoll(order);
        const puzzleAmount = new PuzzleAmountValueObject({
            order,
            amount: 1
        });
        await this.unitOfWork.userPuzzleRepository.addRollPuzzle(userPuzzle, puzzleRollValueObject);
        await this.unitOfWork.userPuzzleRepository.updateHasPuzzle(userPuzzle, puzzleAmount);
    }
}