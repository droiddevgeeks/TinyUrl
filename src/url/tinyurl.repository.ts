import { Injectable } from "@nestjs/common";

@Injectable()
export class TinyUrlRepository {
    private urls: Map<string, string> = new Map();

    save(shortUrl: string, originalUrl: string): void {
        this.urls.set(shortUrl, originalUrl);
    }

    find(originalUrl: string): string | undefined {
        for (const [shortUrl, url] of this.urls.entries()) {
            if (url === originalUrl) {
                return shortUrl;
            }
        }
        return undefined;
    }

    getAll(): Map<string, string> {
        return this.urls;
    }
}