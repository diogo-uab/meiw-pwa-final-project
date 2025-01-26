import { LogLevel } from '@nestjs/common';
import { config } from './env';

const logLevelsList: LogLevel[] = [
  'verbose',
  'debug',
  'log',
  'warn',
  'error',
  'fatal',
] as const;

export const parseLogLevels = () => {
  const isProd = process.env.NODE_ENV === 'production';
  const envLogLevel = config.logLEvel as LogLevel;

  const level: LogLevel = logLevelsList.includes(envLogLevel)
    ? envLogLevel
    : isProd
      ? 'warn'
      : 'verbose';

  return logLevelsList.slice(
    logLevelsList.indexOf(level),
    logLevelsList.length,
  );
};
