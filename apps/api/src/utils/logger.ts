import pino from "pino";
import { env } from "./config.js";

const isProduction = env.NODE_ENV === "production";
const logger = pino(
  isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      },
);

export { logger };
