import winston from "winston";
import { config } from "../config/env";

// ─── Custom Log Format ─────────────────────────────────────────
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: config.isDev }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\n${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// ─── Winston Logger Instance ───────────────────────────────────
const logger = winston.createLogger({
  level: config.isDev ? "debug" : "info",
  format: logFormat,
  transports: [
    // ─── Console output ──────────────────────────────────────
    new winston.transports.Console(),

    // ─── Error log file ──────────────────────────────────────
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: winston.format.uncolorize(),
    }),

    // ─── Combined log file ───────────────────────────────────
    new winston.transports.File({
      filename: "logs/combined.log",
      format: winston.format.uncolorize(),
    }),
  ],
});

export default logger;