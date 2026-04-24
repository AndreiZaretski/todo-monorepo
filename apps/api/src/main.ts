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
          userId: req.user?.id ?? null,
        }),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API documentation for Todo App')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT ?? 4001);
  console.log('port listen ', process.env.PORT);
}
bootstrap();
