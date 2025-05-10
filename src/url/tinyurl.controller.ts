import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  Logger,
} from "@nestjs/common";
import { TinyUrlService } from "./tinyurl.service";
import { CreateUrlDto } from "./model/url.dto";
import { Response } from "express";
import { ShortCodeValidationPipe } from "src/validation/shortcode.validation";

@Controller()
export class TinyUrlController {
  private readonly logger = new Logger(TinyUrlController.name);
  constructor(private readonly tinyUrlService: TinyUrlService) {}

  @Post("url/shorten")
  async shortenUrl(@Body() createUrlDto: CreateUrlDto, @Res() res: Response) {
    const shortUrl = await this.tinyUrlService.generateShortUrl(createUrlDto);
    res.status(201).json({ shortUrl });
  }

  @Get(":shortCode")
  async getUrl(@Param("shortCode", new ShortCodeValidationPipe()) shortCode: string,
   @Res() res: Response) {
    this.logger.log(`Searching original URL for: ${shortCode}`);
    const originalUrl = await this.tinyUrlService.getOriginalUrl(shortCode);
    if (originalUrl) {
      if (
        !originalUrl.startsWith("http://") &&
        !originalUrl.startsWith("https://")
      ) {
        return res.status(400).json({ message: "Invalid original URL" });
      }
      return res.redirect(301, originalUrl);
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  }
}
