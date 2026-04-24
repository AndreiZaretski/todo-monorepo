import { router } from '../index';
import { todoRouter } from './todo';
import { authRouter } from './auth';

export const appRouter = router({
  todo: todoRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
