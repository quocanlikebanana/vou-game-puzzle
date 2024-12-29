import { PrismaService } from "src/infra/prisma.service";

export default class PrismaReaderBase {
    constructor(
        protected readonly prismaService: PrismaService
    ) { }
}