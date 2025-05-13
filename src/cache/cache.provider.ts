import { Provider } from "@nestjs/common";
import { createClient } from 'redis';

export const CacheProvider: Provider = {
  provide: "REDIS_CLIENT",
  useFactory: async () => {
    const client = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT) || 6379,
        },
        password: process.env.REDIS_PASSWORD,
        username: 'default',
    });
    await client.connect();
    return client;
  }
};