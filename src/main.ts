import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CatchEverythingFilter } from './common/error/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './common/error/validation.handle.error';

async function bootstrap() {
	const port = process.env.PORT ?? 3000;
	const host = process.env.HOST ?? 'localhost';
	const app = await NestFactory.create(AppModule);

	const httpAdapterHost = app.get(HttpAdapterHost);
	app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		transform: true,
		exceptionFactory: validationExceptionFactory,
	}));

	await app.listen(port);
	console.log(`[PuzzleGame Service] is running on: ${await app.getUrl()}`);
}
bootstrap();
