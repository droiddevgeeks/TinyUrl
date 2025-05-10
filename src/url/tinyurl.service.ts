import { Injectable, Logger } from "@nestjs/common";
import { CreateUrlDto } from "./model/url.dto";
import { TinyUrlRepository } from "./tinyurl.repository";
import * as crypto from "crypto";

@Injectable()
export class TinyUrlService {
  private readonly logger = new Logger(TinyUrlService.name);
  private readonly baseUrl = "http://localhost:3000/";

  constructor(private readonly tinyUrlRepository: TinyUrlRepository) {}

  async generateShortUrl(createUrlDto: CreateUrlDto): Promise<string> {
    const uniqueCode = this.createMd5Hash(createUrlDto.originalUrl);
    const shortUrl = `${this.baseUrl}${uniqueCode}`;
    try {
      const updatedEntry = await this.tinyUrlRepository.findOneAndUpdate(
        createUrlDto.originalUrl,
        uniqueCode,
        createUrlDto.expiresInDays,
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
          return `${this.baseUrl}${existingEntry?.shortCode}`;
        }
      }
      throw error;
    }
  }

  async getOriginalUrl(shortCode: string): Promise<string | null> {
    this.logger.log(`Retrieving original URL from: ${shortCode}`);
    const urlEntry = await this.tinyUrlRepository.findbyShortUrl(shortCode);
    if (!urlEntry) {
      this.logger.warn(`Short code ${shortCode} not found.`);
      return 'URL not found.';
    }
    if (urlEntry.expiresAt && urlEntry.expiresAt < new Date()) {
      this.logger.warn(`Short code ${shortCode} has expired.`);
      return 'URL has expired.';
    }
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
