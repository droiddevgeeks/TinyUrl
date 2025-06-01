import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class LogThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(LogThrottlerGuard.name);
  protected generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string
  ): string {
    const key = super.generateKey(context, suffix, name);
    this.logger.log("Throttler key:", key);
    return key;
  }
}
