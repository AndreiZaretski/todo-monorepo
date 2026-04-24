import { Request, Response } from 'express';
import type { PrismaService } from 'api/src/prisma/prisma.service';
import type { TodoService } from 'api/src/todo/todo.service';
import type { AuthService } from 'api/src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

export function createContext(opts: {
  req: Request;
  res: Response;
  prisma: PrismaService;
  todoService: TodoService;
  authService: AuthService;
}) {
  const token = opts.req.cookies?.token ?? null;

  let userId: number | null = null;
  if (token) {
    try {
      const jwt = new JwtService({ secret: process.env.JWT_SECRET });
      const payload = jwt.verify(token);
      userId = payload.sub;
    } catch {
      userId = null;
    }
  }

  return {
    ...opts,
    userId,
  };
}

export type Context = ReturnType<typeof createContext>;
