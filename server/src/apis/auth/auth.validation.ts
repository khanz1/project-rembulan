import { z } from 'zod';

export const GoogleLoginSchema = z.object({
  googleToken: z.string({
    message: 'googleToken is required',
  }),
});
