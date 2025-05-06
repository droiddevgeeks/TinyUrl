import { Injectable, Logger } from "@nestjs/common";
import { CreateUrlDto } from "./model/url.dto";

@Injectable()
export class TinyUrlService {
  private readonly logger = new Logger(TinyUrlService.name);
  private urls: Map<string, string> = new Map();

  generateShortUrl(urlDto: CreateUrlDto): string {
    const uniqueCode = this.createShortUrlCode(urlDto.originalUrl);
    const shortUrl = `http://localhost:3000/${uniqueCode}`;
    if (this.urls.has(uniqueCode)) {
      return shortUrl;
    }
    this.urls.set(uniqueCode, urlDto.originalUrl);
    return shortUrl;
  }

  getOriginalUrl(shortCode: string): string | "" {
    this.logger.log(`Retrieving original URL for: ${shortCode}`);
    return this.urls.get(shortCode) || "";
  }

  private createShortUrlCode(originalUrl: string): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
