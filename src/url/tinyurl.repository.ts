import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UrlShortener } from "./model/url.schema";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import * as crypto from "crypto";
import {
  TinyUrlRequestDto,
  TinyUrlResponseDto,
} from "./model/url.dto";

@Injectable()
export class TinyUrlRepository {
  private readonly logger = new Logger(TinyUrlRepository.name);
  private readonly baseUrl = "http://localhost:3000/";
  constructor(
    @InjectModel(UrlShortener.name)
    private readonly urlModel: Model<UrlShortener>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async findOneAndUpdate(
    createUrlDto: TinyUrlRequestDto
  ): Promise<string> {
    const { originalUrl, expiresInDays } = createUrlDto;
    const shortCode = this.createMd5Hash(originalUrl);
    let cacheData = await this.checkIfUrlExistsInCache(shortCode);
    if (cacheData) {
      this.logger.log(`Found in cache : ${JSON.stringify(cacheData)}`);
      return cacheData.shortUrl;
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const dbResult = await this.urlModel
      .findOneAndUpdate(
        { originalUrl },
        { originalUrl, shortCode, expiresAt },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      .exec();
    const result = this.prepareResult(dbResult);
    await this.cacheManager.set(
      this.getCacheKey(shortCode),
      result,
      expiresInDays * 24 * 60 * 60
    );
    return result.shortUrl;
  }

  async findbyShortCode(
    shortCode: string
  ): Promise<TinyUrlResponseDto | null> {
    const cachedData = await this.checkIfUrlExistsInCache(shortCode);
    if (cachedData) {
      this.logger.log(`Found in cache : ${JSON.stringify(cachedData)}`);
      return cachedData;
    }
    const dbResult = await this.urlModel.findOne({ shortCode }).exec();
    if (dbResult) {
      return this.prepareResult(dbResult);
    }
    return null;
  }

  async findByOriginalUrl(originalUrl: string): Promise<TinyUrlResponseDto | null> {
    const dbResult = await this.urlModel.findOne({ originalUrl }).exec();
    if (dbResult) {
      return this.prepareResult(dbResult);
    }
    return null;
  }

  private async checkIfUrlExistsInCache(
    uniqueCode: string
  ): Promise<TinyUrlResponseDto | null> {
    const cacheKey = this.getCacheKey(uniqueCode);
    const cachedData =
      await this.cacheManager.get<TinyUrlResponseDto>(cacheKey);
    return cachedData;
  }

  private createMd5Hash(originalUrl: string): string {
    return crypto
      .createHash("md5")
      .update(originalUrl)
      .digest("hex")
      .substring(0, 8); // Use the first 8 characters
  }

  private getCacheKey(uniqueCode: string): string {
    return `url:${uniqueCode}`;
  }

  private prepareResult(result: UrlShortener){
    return new TinyUrlResponseDto({
      originalUrl: result?.originalUrl,
      shortUrl: `${this.baseUrl}${result?.shortCode}`,
      expiresAt: result?.expiresAt,
    });
  }
}
