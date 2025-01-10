import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/prisma.service";

@Injectable()
export default class PrismaReaderBase {
    constructor(
        protected readonly prismaService: PrismaService
    ) { }
}