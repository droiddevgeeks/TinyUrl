import { Injectable, Logger } from "@nestjs/common";
import { CreateUrlDto } from "./model/url.dto";
import { TinyUrlRepository } from "./tinyurl.repository";
import * as crypto from 'crypto';

@Injectable()
export class TinyUrlService {
  private readonly logger = new Logger(TinyUrlService.name);

  constructor(private readonly tinyUrlRepository: TinyUrlRepository) {}

  async generateShortUrl(createUrlDto: CreateUrlDto): Promise<string> {
    let shortUrl = 'http://localhost:3000/';
    const existingEntry = await this.tinyUrlRepository.findByOriginalUrl(createUrlDto.originalUrl);
    if (existingEntry) {
      this.logger.log(`Short URL already exists: ${existingEntry.shortCode}`);
      shortUrl = `http://localhost:3000/${existingEntry.shortCode}`;
      return shortUrl;
    }
    this.logger.log(`Generating short URL for: ${createUrlDto.originalUrl}`);
    const uniqueCode = this.createMd5Hash(createUrlDto.originalUrl);
    shortUrl = `http://localhost:3000/${uniqueCode}`;
    await this.tinyUrlRepository.createShortUrl(uniqueCode, createUrlDto.originalUrl);
    return shortUrl;
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    this.logger.log(`Retrieving original URL from: ${shortCode}`);
    const urlEntry = await this.tinyUrlRepository.findbyShortUrl(shortCode);
    return urlEntry ? urlEntry.originalUrl : null;
  }

  private createMd5Hash(originalUrl: string): string {
    return crypto.createHash('md5').update(originalUrl).digest('hex').substring(0, 8); // Use the first 8 characters
  }
}
