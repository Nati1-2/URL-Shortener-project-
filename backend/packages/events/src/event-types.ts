export interface BaseEvent<T = any> {
  eventId: string;
  eventType: string;
  timestamp: string;
  source: string;
  version: string;
  correlationId?: string;
  payload: T;
}

export interface ClickRecordedPayload {
  linkId: string;
  workspaceId: string;
  shortCode: string;
  destinationUrl: string;
  ipHash?: string;
  country?: string;
  region?: string;
  city?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  userAgent?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  timestamp: string;
}

export type ClickRecordedEvent = BaseEvent<ClickRecordedPayload>;

export interface LinkCreatedPayload {
  linkId: string;
  workspaceId: string;
  createdBy: string;
  shortCode: string;
  destinationUrl: string;
  title: string;
  createdAt: string;
}

export type LinkCreatedEvent = BaseEvent<LinkCreatedPayload>;

export interface LinkDeletedPayload {
  linkId: string;
  workspaceId: string;
  shortCode: string;
}

export type LinkDeletedEvent = BaseEvent<LinkDeletedPayload>;

export interface SubscriptionUpdatedPayload {
  workspaceId: string;
  planId: string;
  planName: string;
  status: string;
  monthlyClicksLimit: number;
  currentPeriodEnd: string;
}

export type SubscriptionUpdatedEvent = BaseEvent<SubscriptionUpdatedPayload>;

export interface NotificationRequestedPayload {
  id?: string;
  workspaceId?: string;
  userId?: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  metadata?: Record<string, any>;
}

export type NotificationRequestedEvent = BaseEvent<NotificationRequestedPayload>;

export interface WebhookReceivedPayload {
  id: string;
  event: string;
  data: Record<string, any>;
  signature: string;
}

export type WebhookReceivedEvent = BaseEvent<WebhookReceivedPayload>;

export const EVENT_EXCHANGES = {
  LINKPULSE_EVENTS: "linkpulse.events",
  LINKPULSE_DLX: "linkpulse.events.dlx",
} as const;

export const EVENT_TOPICS = {
  CLICK_RECORDED: "linkpulse.click.recorded",
  LINK_CREATED: "linkpulse.link.created",
  LINK_DELETED: "linkpulse.link.deleted",
  SUBSCRIPTION_UPDATED: "linkpulse.subscription.updated",
  NOTIFICATION_REQUESTED: "linkpulse.notification.requested",
  WEBHOOK_RECEIVED: "linkpulse.webhook.received",
} as const;

export const EVENT_QUEUES = {
  ANALYTICS_QUEUE: "linkpulse.analytics.queue",
  NOTIFICATION_QUEUE: "linkpulse.notification.queue",
  WEBHOOK_QUEUE: "linkpulse.webhook.queue",
  DLQ: "linkpulse.deadletter.queue",
} as const;
