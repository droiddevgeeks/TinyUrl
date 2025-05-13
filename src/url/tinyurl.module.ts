import { Module } from "@nestjs/common";
import { TinyUrlController } from "./tinyurl.controller";
import { TinyUrlService } from "./tinyurl.service";
import { TinyUrlRepository } from "./tinyurl.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { UrlShortener, UrlShortenerSchema } from "./model/url.schema";
import { CacheModule } from "src/cache/cache.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UrlShortener.name, schema: UrlShortenerSchema },
    ]),
    CacheModule
  ],
  controllers: [TinyUrlController],
  providers: [TinyUrlService, TinyUrlRepository],
})
export class TinyUrlModule {}
