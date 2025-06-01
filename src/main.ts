import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import { ThrottlerExceptionFilter } from "./middleware/throttler.exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
    }
  ));
  app.useGlobalFilters(new ThrottlerExceptionFilter());
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
