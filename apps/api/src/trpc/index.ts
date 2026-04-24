import { initTRPC } from '@trpc/server';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId || ctx.userId == null) throw new Error('Unauthorized');
  //return next();
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
