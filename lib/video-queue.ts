import { Queue } from "bullmq";
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const REDIS_CONNECTION = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

export const videoQueue = new Queue("video-processing", {
  connection: REDIS_CONNECTION,
});