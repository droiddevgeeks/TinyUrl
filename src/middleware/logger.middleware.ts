import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();
    this.logger.log(`[Request] ${method} ${originalUrl}`);

    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    this.logger.log(`Request from IP: ${ip}`);

    res.on("finish", () => {
      const { statusCode } = res;
      const endTime = Date.now();
      const duration = endTime - startTime;

      this.logger.log(
        `[Response] ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
      );
    });

    next();
  }
}
