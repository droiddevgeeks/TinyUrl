import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { TinyUrlModule } from "./url/tinyurl.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule } from "./cache/cache.module";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { LogThrottlerGuard } from "./middleware/throttler.gaurd";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://localhost:27017/tinyurl"
    ),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: Number(process.env.THROTTLE_TTL) || 60000,
          limit: Number(process.env.THROTTLE_LIMIT) || 10,
        }
      ],
      storage: new ThrottlerStorageRedisService(`redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
    }),
    CacheModule,
    TinyUrlModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: LogThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
