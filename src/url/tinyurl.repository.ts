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
  ): Promise<{ isNew: boolean }> {
    const result = await this.urlModel
      .findOneAndUpdate(
        { originalUrl },
        { originalUrl, shortCode },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
    return { isNew: result.createdAt === result.updatedAt };
  }

  async findbyShortUrl(shortCode: string): Promise<UrlShortener | null> {
    return this.urlModel.findOne({ shortCode }).exec();
  }

  async findByOriginalUrl(originalUrl: string): Promise<UrlShortener | null> {
    return this.urlModel.findOne({ originalUrl }).exec();
  }
}
