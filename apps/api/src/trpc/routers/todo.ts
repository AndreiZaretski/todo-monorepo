import { z } from 'zod';
import { router, protectedProcedure } from '../index';

export const todoRouter = router({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.todoService.findAll(ctx.userId);
  }),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.todoService.create(ctx.userId, { text: input.text });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), text: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.todoService.update(ctx.userId, input.id, { text: input.text });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.todoService.remove(ctx.userId, input.id);
    }),
});
