import { Injectable, Logger } from "@nestjs/common";
import { TinyUrlRequestDto } from "./model/url.dto";
import { TinyUrlRepository } from "./tinyurl.repository";

@Injectable()
export class TinyUrlService {
  private readonly logger = new Logger(TinyUrlService.name);

  constructor(private readonly tinyUrlRepository: TinyUrlRepository) {}

  async generateShortUrl(createUrlDto: TinyUrlRequestDto): Promise<string> {
    try {
      const shortUrl = await this.tinyUrlRepository.findOneAndUpdate(
        createUrlDto
      );

      this.logger.log(`Generated Short URL : ${shortUrl} for Original Url : ${createUrlDto.originalUrl}`);
      return shortUrl;
    } catch (error: any) {
      if (this.isMongoError(error) && error.code === 11000) {
        this.logger.warn(
          `Duplicate entry detected for URL: ${createUrlDto.originalUrl}`,
        );
        const existingUrl = await this.tinyUrlRepository.findByOriginalUrl(
          createUrlDto.originalUrl,
        );
        return existingUrl?.shortUrl || "URL not found.";
      }
      throw error;
    }
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    const urlData = await this.tinyUrlRepository.findbyShortCode(shortCode);
    if (!urlData) {
      this.logger.warn(`Short code ${shortCode} not found.`);
      return 'URL not found.';
    }
    if (urlData.expiresAt && urlData.expiresAt < new Date()) {
      this.logger.warn(`Short code ${shortCode} has expired.`);
      return 'URL has expired.';
    }
    return urlData ? urlData.originalUrl : null;
  }


  private isMongoError(error: any): error is { code: number } {
    return error && typeof error.code === "number";
  }
}
