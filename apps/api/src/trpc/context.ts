import { Request, Response } from 'express';
import type { PrismaService } from 'api/src/prisma/prisma.service';
import type { TodoService } from 'api/src/todo/todo.service';
import type { AuthService } from 'api/src/auth/auth.service';

export function createContext(opts: {
  req: Request;
  res: Response;
  prisma: PrismaService;
  todoService: TodoService;
  authService: AuthService;
  userId: number | null;
}) {
  return opts;
}

export type Context = ReturnType<typeof createContext>;
