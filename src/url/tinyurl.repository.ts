import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlShortener } from './model/url.schema';
import { CreateUrlDto } from './model/url.dto';

@Injectable()
export class TinyUrlRepository {
  constructor(
    @InjectModel(UrlShortener.name) private readonly urlModel: Model<UrlShortener>,
  ) {}

  async createShortUrl(shortCode: string, originalUrl: string): Promise<UrlShortener> {
    const newUrl = new this.urlModel({ shortCode, originalUrl });
    return newUrl.save();
  }

  async findbyShortUrl(shortCode: string): Promise<UrlShortener | null> {
    return this.urlModel.findOne({ shortCode }).exec();
  }

  async findByOriginalUrl(originalUrl: string): Promise<UrlShortener | null> {
    return this.urlModel.findOne({ originalUrl }).exec();
  }
}