import { ConsoleLogger } from "./console";

export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

const getLogger = (): Logger => {
  return new ConsoleLogger();
};

export const logger = getLogger();
