import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { CacheProvider } from "./cache.provider";

@Module({
  imports: [],
  controllers: [],
  providers: [CacheService, CacheProvider],
  exports: [CacheService],
})
export class CacheModule {}
