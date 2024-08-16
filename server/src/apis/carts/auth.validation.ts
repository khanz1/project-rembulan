import { z } from 'zod';

export const GoogleLoginSchema = z.object({
  googleToken: z.string({
    message: 'googleLogin is required',
  }),
});
