import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import LoggerService from './logger.service';
import { UnitOfWork } from './unit-of-work';
import { IUnitOfWork } from 'src/domain/common/unit-of-work.i';

@Module({
    providers: [
        PrismaService,
        LoggerService,
        UnitOfWork,
        {
            provide: IUnitOfWork,
            useExisting: UnitOfWork
        }
    ],
    exports: [
        PrismaService,
        LoggerService,
        IUnitOfWork
    ],
})
export class InfraModule { }
