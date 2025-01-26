import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  private readonly errorLogger = new Logger('HTTP_ERROR');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const ip = req.headers['x-real-ip'] || req.socket.remoteAddress || req.ip;
    this.logger.log(`${method} ${originalUrl} - ${ip}`);

    res.on('close', () => {
      const { statusCode } = res;
      if (statusCode < 400) return;
      this.errorLogger.log(`${method} ${originalUrl} (${statusCode}) - ${ip}`);
    });

    next();
  }
}
