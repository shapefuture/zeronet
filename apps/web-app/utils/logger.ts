export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR"
}

export function log(level: LogLevel, msg: string, ...args: any[]) {
  const time = new Date().toISOString();
  // eslint-disable-next-line no-console
  if (level === LogLevel.ERROR) console.error(`[${time}] [${level}]`, msg, ...args, new Error().stack);
  else if (level === LogLevel.WARN) console.warn(`[${time}] [${level}]`, msg, ...args);
  else if (level === LogLevel.INFO) console.info(`[${time}] [${level}]`, msg, ...args);
  else console.debug(`[${time}] [${level}]`, msg, ...args);
}
