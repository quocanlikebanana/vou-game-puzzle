import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import PuzzleGameController from './controllers/puzzle-game/puzzle-game.controller';
import UserPuzzleController from './controllers/user-puzzle/user-puzzle.controller';
import { InfraModule } from './infra/infra.module';
import CreatePuzzleCommand from './commands/puzzle/create-puzzle/create-puzzle.command';
import DeletePuzzleCommand from './commands/puzzle/delete-puzzle/delete-puzzle.command';
import ExchangePuzzleCommand from './commands/user/exchange-puzzle/exchange-puzzle.command';
import JoinPuzzleCommand from './commands/user/join-puzzle/join-puzzle.command';
import RollPuzzleCommand from './commands/user/roll-puzzle/roll-puzzle.command';
import TradePuzzleCommand from './commands/user/trade-puzzle/trade-puzzle.command';
import PuzzleDetailReader from './readers/puzzle/detail/puzzle-details.reader';
import ExchangeHistoryReader from './readers/user/exchange-history/exchange-history.reader';
import GetUserPuzzlesReader from './readers/user/get-user-puzzles/get-user-puzzles.reader';
import RollHistoryReader from './readers/user/roll-history/roll-history.reader';
import TradeHistoryReader from './readers/user/trade-history/trade-history.reader';
import { HttpModule } from '@nestjs/axios';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfraModule,
    HttpModule,
    StatsModule,
  ],
  providers: [
    CreatePuzzleCommand,
    DeletePuzzleCommand,
    ExchangePuzzleCommand,
    JoinPuzzleCommand,
    RollPuzzleCommand,
    TradePuzzleCommand,

    PuzzleDetailReader,
    ExchangeHistoryReader,
    GetUserPuzzlesReader,
    RollHistoryReader,
    TradeHistoryReader
  ],
  controllers: [
    PuzzleGameController,
    UserPuzzleController,
  ],
})
export class AppModule { }
