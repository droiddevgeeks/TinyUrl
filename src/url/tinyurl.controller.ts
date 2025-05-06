import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { TinyUrlService } from "./tinyurl.service";
import { CreateUrlDto } from "./model/url.dto";

@Controller('url')
export class TinyUrlController {
    constructor(private readonly tinyUrlService: TinyUrlService) {}

    @Post('shorten')
    async shortenUrl(@Body() createUrlDto: CreateUrlDto) {
        return this.tinyUrlService.generateShortUrl(createUrlDto);
    }


    @Get(':shortUrl')
    async getUrl(@Param('shortUrl') shortUrl: string) {
        return this.tinyUrlService.getOriginalUrl(shortUrl);
    }
}