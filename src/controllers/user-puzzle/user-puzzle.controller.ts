import { Body, Controller, Get, Post } from "@nestjs/common";
import ExchangePuzzleCommand from "src/commands/user/exchange-puzzle/exchange-puzzle.command";
import ExchangePuzzleParam from "src/commands/user/exchange-puzzle/exchange-puzzle.param";
import JoinPuzzleCommand from "src/commands/user/join-puzzle/join-puzzle.command";
import JoinPuzzleParam from "src/commands/user/join-puzzle/join-puzzle.param";
import RollPuzzleCommand from "src/commands/user/roll-puzzle/roll-puzzle.command";
import RollPuzzleParam from "src/commands/user/roll-puzzle/roll-puzzle.param";
import TradePuzzleCommand from "src/commands/user/trade-puzzle/trade-puzzle.command";
import TradePuzzleParam from "src/commands/user/trade-puzzle/trade-puzzle.param";
import ExchangeHistoryParam from "src/readers/user/exchange-history/exchange-history.param";
import ExchangeHistoryReader from "src/readers/user/exchange-history/exchange-history.reader";
import GetUserPuzzlesParam from "src/readers/user/get-user-puzzles/get-user-puzzles.param";
import GetUserPuzzlesReader from "src/readers/user/get-user-puzzles/get-user-puzzles.reader";
import RollHistoryParam from "src/readers/user/roll-history/roll-history.param";
import RollHistoryReader from "src/readers/user/roll-history/roll-history.reader";
import TradeHistoryParam from "src/readers/user/trade-history/trade-history.param";
import TradeHistoryReader from "src/readers/user/trade-history/trade-history.reader";

@Controller('user-puzzle')
export default class UserPuzzleController {
    constructor(
        private readonly exchangePuzzleCommand: ExchangePuzzleCommand,
        private readonly joinPuzzleCommand: JoinPuzzleCommand,
        private readonly rollPuzzleCommand: RollPuzzleCommand,
        private readonly tradePuzzleCommand: TradePuzzleCommand,
        private readonly exchangeHistoryReader: ExchangeHistoryReader,
        private readonly getUserPuzzlesReader: GetUserPuzzlesReader,
        private readonly rollHistoryReader: RollHistoryReader,
        private readonly tradeHistoryReader: TradeHistoryReader
    ) { }

    @Post('exchange')
    async exchangePuzzle(@Body() exchangePuzzleParam: ExchangePuzzleParam) {
        return await this.exchangePuzzleCommand.execute(exchangePuzzleParam);
    }

    @Post('join')
    async joinPuzzle(@Body() joinPuzzleParam: JoinPuzzleParam) {
        return await this.joinPuzzleCommand.execute(joinPuzzleParam);
    }

    @Post('roll')
    async rollPuzzle(@Body() rollPuzzleParam: RollPuzzleParam) {
        return await this.rollPuzzleCommand.execute(rollPuzzleParam);
    }

    @Post('trade')
    async tradePuzzle(@Body() tradePuzzleParam: TradePuzzleParam) {
        return await this.tradePuzzleCommand.execute(tradePuzzleParam);
    }

    @Get('exchange-history')
    async exchangeHistory(@Body() exchangeHistoryParam: ExchangeHistoryParam) {
        return await this.exchangeHistoryReader.read(exchangeHistoryParam);
    }

    @Get('get-user-puzzles')
    async getUserPuzzles(@Body() getUserPuzzlesParam: GetUserPuzzlesParam) {
        return await this.getUserPuzzlesReader.read(getUserPuzzlesParam);
    }

    @Get('roll-history')
    async rollHistory(@Body() rollHistoryParam: RollHistoryParam) {
        return await this.rollHistoryReader.read(rollHistoryParam);
    }

    @Get('trade-history')
    async tradeHistory(@Body() tradeHistoryParam: TradeHistoryParam) {
        return await this.tradeHistoryReader.read(tradeHistoryParam);
    }
}