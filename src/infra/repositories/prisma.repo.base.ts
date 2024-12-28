import { PrismaService } from "../prisma.service";

export abstract class PrismaRepositoryBase {
    constructor(
        protected readonly prismaService: PrismaService
    ) { }
}