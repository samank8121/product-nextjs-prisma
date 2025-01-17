import { z } from 'zod';

export const loginSchema = (t?: any) =>
  z.object({
    username: z
      .string({ message: t('General.required', { param: 'username' }) })
      .min(1, { message: t('General.required', { param: 'username' }) }),
    password: z
      .string({ message: t('General.required', { param: 'password' }) })
      .min(1, { message: t('General.required', { param: 'password' }) }),
  });

export type LoginSchema = z.infer<ReturnType<typeof loginSchema>>;

export const registerSchema = (t: any) =>
  z.object({
      username: z.string().min(1, { message: t('General.required', { param: 'username' }) }),
      email: z.string().email({ message: t('Auth.email') }),
      password: z.string().min(8, { message: t('Auth.password') }),
      confirmation: z.string().min(8, { message: t('Auth.password') }),
    })
    .refine((d) => d.password === d.confirmation, {
      message: t('Auth.rePassword'),
      path: ['confirmation'],
    });
export type RegisterSchema = z.infer<ReturnType<typeof registerSchema>>;