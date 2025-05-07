import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TinyUrlModule } from "./url/tinyurl.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://localhost:27017/tinyurl"
    ),
    TinyUrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
