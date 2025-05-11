import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  Logger,
  HttpStatus,
} from "@nestjs/common";
import { TinyUrlService } from "./tinyurl.service";
import { TinyUrlRequestDto } from "./model/url.dto";
import { Response } from "express";
import { ShortCodeValidationPipe } from "src/validation/shortcode.validation";
import { isURL } from "class-validator";

@Controller()
export class TinyUrlController {
  private readonly logger = new Logger(TinyUrlController.name);
  constructor(private readonly tinyUrlService: TinyUrlService) {}

  @Post("url/shorten")
  async shortenUrl(@Body() createUrlDto: TinyUrlRequestDto, @Res() res: Response) {
    const shortUrl = await this.tinyUrlService.generateShortUrl(createUrlDto);
    res.status(HttpStatus.CREATED).json({ shortUrl });
  }

  @Get(":shortCode")
  async getUrl(@Param("shortCode", new ShortCodeValidationPipe()) shortCode: string,
   @Res() res: Response) {
    this.logger.log(`Searching original URL for: ${shortCode}`);
    const originalUrl = await this.tinyUrlService.getOriginalUrl(shortCode);
    if (originalUrl) {
      if(!isURL(originalUrl)) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: originalUrl });
      }
      return res.redirect(HttpStatus.TEMPORARY_REDIRECT, originalUrl);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "URL not found" });
    }
  }
}
