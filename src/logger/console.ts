import { Logger } from "./logger";

enum LogLevel {
  debug = 1,
  info = 2,
  warn = 3,
  error = 4,
}

const logLevels = new Map<string, LogLevel>([
  ["debug", LogLevel.debug],
  ["info", LogLevel.info],
  ["warn", LogLevel.warn],
  ["error", LogLevel.error],
]);

const logLevel = LogLevel.debug;

export class ConsoleLogger implements Logger {
  debug(...args: any[]): void {
    if (logLevel <= LogLevel.debug) {
      console.debug(args);
    }
  }

  info(...args: any[]): void {
    if (logLevel <= LogLevel.info) {
      console.info(args);
    }
  }

  warn(...args: any[]): void {
    if (logLevel <= LogLevel.warn) {
      console.warn(args);
    }
  }

  error(...args: any[]): void {
    if (logLevel <= LogLevel.error) {
      console.error(args);
    }
  }
}
