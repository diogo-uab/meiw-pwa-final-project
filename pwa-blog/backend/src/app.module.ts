import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { config } from './config/env';
import { HTTPLoggerMiddleware } from './middleware/http-logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { BlogCommentModule } from './blog-comment/blog-comment.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongodbConnectionURL),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    BlogPostModule,
    BlogCommentModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HTTPLoggerMiddleware).forRoutes('*');
  }
}
