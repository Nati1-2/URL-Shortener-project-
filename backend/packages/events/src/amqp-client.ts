import amqplib, { Channel, Connection } from "amqplib";
import { EventEmitter } from "events";
import Redis from "ioredis";
import {
  BaseEvent,
  EVENT_EXCHANGES,
  EVENT_QUEUES,
  EVENT_TOPICS,
} from "./event-types";

export class EventBroker {
  private connection: any = null;
  private channel: any = null;
  private isConnecting: boolean = false;
  private url: string;
  private redisPub: Redis | null = null;
  private redisSub: Redis | null = null;
  private localEmitter: EventEmitter = new EventEmitter();
  private amqpAvailable: boolean = false;

  constructor(url: string = process.env.RABBITMQ_URL || "amqp://localhost:5672") {
    this.url = url;
    this.localEmitter.setMaxListeners(50);
  }

  public async connect(): Promise<void> {
    if (this.connection && this.channel) return;
    if (this.isConnecting) return;

    this.isConnecting = true;

    // 1. Try RabbitMQ if URL is explicitly provided or default
    try {
      this.connection = await amqplib.connect(this.url);
      this.channel = await this.connection.createChannel();

      // Setup main topic exchange
      await this.channel.assertExchange(EVENT_EXCHANGES.LINKPULSE_EVENTS, "topic", {
        durable: true,
      });

      // Setup Dead-Letter Exchange (DLX)
      await this.channel.assertExchange(EVENT_EXCHANGES.LINKPULSE_DLX, "topic", {
        durable: true,
      });

      // Setup Dead-Letter Queue
      await this.channel.assertQueue(EVENT_QUEUES.DLQ, { durable: true });
      await this.channel.bindQueue(EVENT_QUEUES.DLQ, EVENT_EXCHANGES.LINKPULSE_DLX, "#");

      this.connection.on("error", (err: any) => {
        console.error("[EventBroker] AMQP connection error:", err.message);
        this.amqpAvailable = false;
        this.reconnect();
      });

      this.connection.on("close", () => {
        console.warn("[EventBroker] AMQP connection closed. Reconnecting...");
        this.amqpAvailable = false;
        this.reconnect();
      });


      this.isConnecting = false;
      this.amqpAvailable = true;
      console.log("[EventBroker] Connected to RabbitMQ successfully.");
      return;
    } catch (err: any) {
      this.isConnecting = false;
      this.amqpAvailable = false;
      console.log(`[EventBroker] RabbitMQ offline (${err.message}). Using cloud Redis / In-Memory Event Bus fallback.`);
    }

    // 2. Initialize Redis Pub/Sub fallback if REDIS_URL exists
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl && !this.redisPub) {
      try {
        this.redisPub = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
        this.redisSub = new Redis(redisUrl, { lazyConnect: true, maxRetriesPerRequest: 1 });
        await this.redisPub.connect().catch(() => {});
        await this.redisSub.connect().catch(() => {});

        this.redisSub.on("message", (channel, message) => {
          try {
            const parsed = JSON.parse(message);
            this.localEmitter.emit(channel, parsed);
          } catch {
            // ignore
          }
        });
      } catch {
        // use in-memory fallback
      }
    }
  }

  private reconnect(): void {
    this.connection = null;
    this.channel = null;
    setTimeout(() => this.connect(), 10000);
  }

  public async publish<T>(topic: string, event: BaseEvent<T>): Promise<boolean> {
    try {
      if (this.amqpAvailable && this.channel) {
        const buffer = Buffer.from(JSON.stringify(event));
        return this.channel.publish(EVENT_EXCHANGES.LINKPULSE_EVENTS, topic, buffer, {
          persistent: true,
          contentType: "application/json",
          messageId: event.eventId,
          timestamp: new Date(event.timestamp).getTime(),
        });
      }

      // Redis Fallback
      if (this.redisPub && this.redisPub.status === "ready") {
        await this.redisPub.publish(`event:${topic}`, JSON.stringify(event));
      }

      // Local In-Memory Fallback
      this.localEmitter.emit(`event:${topic}`, event);
      this.localEmitter.emit("event:*", event);
      return true;
    } catch (err: any) {
      console.warn(`[EventBroker] Publish fallback on ${topic}:`, err.message);
      this.localEmitter.emit(`event:${topic}`, event);
      return true;
    }
  }

  public async subscribe<T>(
    queueName: string,
    topicPatterns: string[],
    handler: (event: BaseEvent<T>) => Promise<void>
  ): Promise<void> {
    try {
      if (!this.connection && !this.amqpAvailable) {
        await this.connect();
      }

      if (this.amqpAvailable && this.channel) {
        await this.channel.assertQueue(queueName, {
          durable: true,
          deadLetterExchange: EVENT_EXCHANGES.LINKPULSE_DLX,
        });

        for (const pattern of topicPatterns) {
          await this.channel.bindQueue(queueName, EVENT_EXCHANGES.LINKPULSE_EVENTS, pattern);
        }

        await this.channel.prefetch(10);

        this.channel.consume(queueName, async (msg: any) => {
          if (!msg) return;

          try {
            const content: BaseEvent<T> = JSON.parse(msg.content.toString());
            await handler(content);
            this.channel?.ack(msg);
          } catch (processErr: any) {
            console.error(`[EventBroker] Error processing event from ${queueName}:`, processErr.message);
            this.channel?.nack(msg, false, false);
          }
        });

        console.log(`[EventBroker] Subscribed queue '${queueName}' to patterns:`, topicPatterns);
        return;
      }

      // Redis / In-Memory Subscription Fallback
      for (const pattern of topicPatterns) {
        const channelKey = `event:${pattern}`;
        if (this.redisSub && this.redisSub.status === "ready") {
          await this.redisSub.subscribe(channelKey).catch(() => {});
        }
        this.localEmitter.on(channelKey, async (ev) => {
          try {
            await handler(ev);
          } catch (e: any) {
            console.error(`[EventBroker] Fallback handler error on ${pattern}:`, e.message);
          }
        });
      }

      console.log(`[EventBroker] Subscribed fallback bus for '${queueName}' to patterns:`, topicPatterns);
    } catch (err: any) {
      console.error(`[EventBroker] Subscribe error for ${queueName}:`, err.message);
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      if (this.redisPub) await this.redisPub.quit().catch(() => {});
      if (this.redisSub) await this.redisSub.quit().catch(() => {});
      this.channel = null;
      this.connection = null;
      this.localEmitter.removeAllListeners();
    } catch (err: any) {
      console.error("[EventBroker] Error during close:", err.message);
    }
  }
}

export const eventBroker = new EventBroker();

