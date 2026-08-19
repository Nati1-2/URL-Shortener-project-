import { Redis as UpstashRedis } from "@upstash/redis";
import Redis from "ioredis";

export interface RedisClient {
  get(key: string): Promise<string | null>;
  setex(key: string, seconds: number, value: string): Promise<any>;
  del(key: any): Promise<any>;
  publish(channel: string, message: string): Promise<any>;
  on(event: string, callback: (...args: any[]) => void): any;
}

class UpstashRedisAdapter implements RedisClient {
  private client: UpstashRedis;

  constructor(url: string, token: string) {
    this.client = new UpstashRedis({ url, token });
  }

  async get(key: string): Promise<string | null> {
    const res = await this.client.get(key);
    if (res === null) return null;
    if (typeof res === "object") return JSON.stringify(res);
    return String(res);
  }

  async setex(key: string, seconds: number, value: string): Promise<any> {
    return this.client.set(key, value, { ex: seconds });
  }

  async del(key: any): Promise<any> {
    const keys = Array.isArray(key) ? key : [key];
    return this.client.del(...keys);
  }

  async publish(channel: string, message: string): Promise<any> {
    return this.client.publish(channel, message);
  }

  on(event: string, callback: (...args: any[]) => void): this {
    // Upstash is REST-based and connectionless, so connection events aren't needed.
    // Call non-error events immediately, ignore errors.
    if (event !== "error") {
      setTimeout(() => callback(), 0);
    }
    return this;
  }
}

export function createRedisClient(): RedisClient {
  const restUrl = process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (restUrl && restToken) {
    console.log("[Redis] Using Upstash Redis REST Client");
    return new UpstashRedisAdapter(restUrl, restToken);
  }

  const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
  console.log("[Redis] Using ioredis Client");
  const client = new Redis(REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });
  return client as any as RedisClient;
}
