import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: undefined,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    // throw new Error('Unauthorized');
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Пользователь не авторизован',
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
