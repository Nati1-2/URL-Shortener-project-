import amqplib, { Channel, Connection } from "amqplib";
import {
  BaseEvent,
  EVENT_EXCHANGES,
  EVENT_QUEUES,
  EVENT_TOPICS,
} from "./event-types";

export class EventBroker {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private isConnecting: boolean = false;
  private url: string;

  constructor(url: string = process.env.RABBITMQ_URL || "amqp://localhost:5672") {
    this.url = url;
  }

  public async connect(): Promise<void> {
    if (this.connection && this.channel) return;
    if (this.isConnecting) return;

    this.isConnecting = true;

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

      this.connection.on("error", (err) => {
        console.error("[EventBroker] AMQP connection error:", err.message);
        this.reconnect();
      });

      this.connection.on("close", () => {
        console.warn("[EventBroker] AMQP connection closed. Reconnecting...");
        this.reconnect();
      });

      this.isConnecting = false;
      console.log("[EventBroker] Connected to RabbitMQ successfully.");
    } catch (err: any) {
      this.isConnecting = false;
      console.warn(`[EventBroker] Failed to connect to RabbitMQ (${this.url}): ${err.message}. Event publishing will be queued/bypassed in offline mode.`);
    }
  }

  private reconnect(): void {
    this.connection = null;
    this.channel = null;
    setTimeout(() => this.connect(), 5000);
  }

  public async publish<T>(topic: string, event: BaseEvent<T>): Promise<boolean> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      if (!this.channel) {
        console.warn(`[EventBroker] Warning: Channel unavailable, dropped event on topic: ${topic}`);
        return false;
      }

      const buffer = Buffer.from(JSON.stringify(event));
      return this.channel.publish(EVENT_EXCHANGES.LINKPULSE_EVENTS, topic, buffer, {
        persistent: true,
        contentType: "application/json",
        messageId: event.eventId,
        timestamp: new Date(event.timestamp).getTime(),
      });
    } catch (err: any) {
      console.error(`[EventBroker] Publish error on ${topic}:`, err.message);
      return false;
    }
  }

  public async subscribe<T>(
    queueName: string,
    topicPatterns: string[],
    handler: (event: BaseEvent<T>) => Promise<void>
  ): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect();
      }

      if (!this.channel) {
        throw new Error("Cannot subscribe: AMQP Channel not established");
      }

      // Assert queue with DLX dead-lettering configuration
      await this.channel.assertQueue(queueName, {
        durable: true,
        deadLetterExchange: EVENT_EXCHANGES.LINKPULSE_DLX,
      });

      // Bind each pattern to the main exchange
      for (const pattern of topicPatterns) {
        await this.channel.bindQueue(queueName, EVENT_EXCHANGES.LINKPULSE_EVENTS, pattern);
      }

      await this.channel.prefetch(10);

      this.channel.consume(queueName, async (msg) => {
        if (!msg) return;

        try {
          const content: BaseEvent<T> = JSON.parse(msg.content.toString());
          await handler(content);
          this.channel?.ack(msg);
        } catch (processErr: any) {
          console.error(`[EventBroker] Error processing event from ${queueName}:`, processErr.message);
          // Reject and send to DLQ if persistent error
          this.channel?.nack(msg, false, false);
        }
      });

      console.log(`[EventBroker] Subscribed queue '${queueName}' to patterns:`, topicPatterns);
    } catch (err: any) {
      console.error(`[EventBroker] Subscribe error for ${queueName}:`, err.message);
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.channel = null;
      this.connection = null;
    } catch (err: any) {
      console.error("[EventBroker] Error during AMQP close:", err.message);
    }
  }
}

export const eventBroker = new EventBroker();
