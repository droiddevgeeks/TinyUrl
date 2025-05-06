import { Module } from '@nestjs/common';
import { TinyUrlController } from './tinyurl.controller';
import { TinyUrlService } from './tinyurl.service';
import { TinyUrlRepository } from './tinyurl.repository';

@Module({
  controllers: [TinyUrlController],
  providers: [TinyUrlService, TinyUrlRepository],
})
export class TinyUrlModule {}