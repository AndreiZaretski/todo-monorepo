import { z } from 'zod';
import { router, publicProcedure } from '../index';

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.email({ message: 'Invalid email' }),
      password: z.string().min(6),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.authService.register(input);
    }),

  login: publicProcedure
    .input(z.object({
      email: z.email({ message: 'Invalid email' }),
      password: z.string().min(1),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.authService.login(input);
    }),
});
