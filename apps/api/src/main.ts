import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import * as trpcExpress from '@trpc/server/adapters/express';
import { PrismaService } from './prisma/prisma.service';
import { TodoService } from './todo/todo.service';
import { AuthService } from './auth/auth.service';
import { appRouter } from './trpc/routers/_app';
import { createContext } from './trpc/context';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const prisma = app.get(PrismaService);
  const todoService = app.get(TodoService);
  const authService = app.get(AuthService);

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: ({ req, res }) =>
        createContext({
          req,
          res,
          prisma,
          todoService,
          authService,
        }),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API documentation for Todo App')
    .setVersion('1.0')
    .addCookieAuth('token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      withCredentials: true,
    },
  });
  await app.listen(process.env.PORT ?? 4001);
  console.log('port listen ', process.env.PORT);
}
bootstrap();
