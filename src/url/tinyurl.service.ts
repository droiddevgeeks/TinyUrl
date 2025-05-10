import { Injectable, Logger } from "@nestjs/common";
import { CreateUrlDto } from "./model/url.dto";
import { TinyUrlRepository } from "./tinyurl.repository";
import * as crypto from "crypto";

@Injectable()
export class TinyUrlService {
  private readonly logger = new Logger(TinyUrlService.name);

  constructor(private readonly tinyUrlRepository: TinyUrlRepository) {}

  async generateShortUrl(createUrlDto: CreateUrlDto): Promise<string> {
    const uniqueCode = this.createMd5Hash(createUrlDto.originalUrl);
    const shortUrl = `http://localhost:3000/${uniqueCode}`;

    try {
      const updatedEntry = await this.tinyUrlRepository.findOneAndUpdate(
        createUrlDto.originalUrl,
        uniqueCode,
      );

      this.logger.log(
        updatedEntry.isNew
          ? `Created new short URL: ${shortUrl}`
          : `Short URL already exists: ${shortUrl}`,
      );

      return shortUrl;
    } catch (error: any) {
      if (this.isMongoError(error) && error.code === 11000) {
        this.logger.warn(
          `Duplicate entry detected for URL: ${createUrlDto.originalUrl}`,
        );
        const existingEntry = await this.tinyUrlRepository.findByOriginalUrl(
          createUrlDto.originalUrl,
        );
        if (existingEntry?.shortCode) {
          return `http://localhost:3000/${existingEntry?.shortCode}`;
        }
      }
      throw error;
    }
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    this.logger.log(`Retrieving original URL from: ${shortCode}`);
    const urlEntry = await this.tinyUrlRepository.findbyShortUrl(shortCode);
    return urlEntry ? urlEntry.originalUrl : null;
  }

  private createMd5Hash(originalUrl: string): string {
    return crypto
      .createHash("md5")
      .update(originalUrl)
      .digest("hex")
      .substring(0, 8); // Use the first 8 characters
  }

  private isMongoError(error: any): error is { code: number } {
    return error && typeof error.code === "number";
  }
}
