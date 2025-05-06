import { Injectable } from "@nestjs/common";
import { CreateUrlDto } from "./model/url.dto";

@Injectable()
export class TinyUrlService {
    private urls: Map<string, string> = new Map();

    generateShortUrl(urlDto: CreateUrlDto): string {
        const shortUrl = this.createShortUrl(urlDto.originalUrl);
        this.urls.set(shortUrl, urlDto.originalUrl);
        return shortUrl;
    }

    getOriginalUrl(shortUrl: string): string | null {
        return this.urls.get(shortUrl) || null;
    }

    private createShortUrl(originalUrl: string): string {
        return Math.random().toString(36).substring(2, 8);
    }
}