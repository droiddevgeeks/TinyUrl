import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UrlShortener } from "./model/url.schema";
import { CreateUrlDto } from "./model/url.dto";

@Injectable()
export class TinyUrlRepository {
  constructor(
    @InjectModel(UrlShortener.name)
    private readonly urlModel: Model<UrlShortener>,
  ) {}

  async findOneAndUpdate(
    originalUrl: string,
    shortCode: string,
    expiresInDays: number,
  ): Promise<{ isNew: boolean }> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const result = await this.urlModel
      .findOneAndUpdate(
        { originalUrl },
        { originalUrl, shortCode, expiresAt },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
      const isNew = result.createdAt?.getTime() === result.updatedAt?.getTime();
      return { isNew };
  }

  async findbyShortUrl(shortCode: string): Promise<UrlShortener | null> {
    return this.urlModel.findOne({ shortCode }).exec();
  }

  async findByOriginalUrl(originalUrl: string): Promise<UrlShortener | null> {
    return this.urlModel.findOne({ originalUrl }).exec();
  }
}
