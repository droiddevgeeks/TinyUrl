import { RedisClientType } from "redis";
import {
  Injectable,
  OnModuleDestroy,
  Inject,
  Logger,
} from "@nestjs/common";

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  constructor(
    @Inject("REDIS_CLIENT")
    private readonly redisClient: RedisClientType
  ) {}

  async onModuleDestroy() {
    this.logger.log("Disconnecting from Redis...");
    await this.disconnect();
    this.logger.log("Disconnected from Redis");
  }

  async connect() {
    await this.redisClient.connect();
  }

  async disconnect() {
    await this.redisClient.quit();
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const storedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    if (ttl) {
      await this.redisClient.set(key, storedValue, { EX: ttl });
    } else {
      await this.redisClient.set(key, storedValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (err) {
      return value as unknown as T;
    }
  }
}
