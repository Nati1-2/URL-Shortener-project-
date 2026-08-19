import { createRedisClient } from "@linkpulse/common";

export const redis = createRedisClient();

redis.on("error", (err) => {
  // Silent catch in offline development
});
