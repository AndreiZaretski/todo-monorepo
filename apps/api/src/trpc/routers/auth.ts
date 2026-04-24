import { z } from 'zod';
import { router, publicProcedure } from '../index';

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.email({ message: 'Invalid email' }),
        password: z.string().min(5),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.authService.register(input);
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.email({ message: 'Invalid email' }),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { token, user } = await ctx.authService.login(input);

      ctx.res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true на проде
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return { user };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    ctx.res.clearCookie('token', {
      path: '/',
    });

    return { success: true };
  }),
});
