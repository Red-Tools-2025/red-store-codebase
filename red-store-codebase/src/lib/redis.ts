import { Redis } from "ioredis";

// Initializing redis instance
export const redis = new Redis({
  host: "localhost",
  port: 6379,
});
