import { z } from 'zod';

export const createProductSchema = (t: any) =>
  z.object({
    caption: z
      .string({ message: t('General.required', { param: 'caption' }) })
      .min(1, { message: t('General.required', { param: 'caption' }) }),
    price: z
      .number()
      .refine((value) => Number.isFinite(value) && !Number.isInteger(value), {
        message: t('Product.price'),
      }),
    slug: z
      .string({ message: t('General.required', { param: 'slug' }) })
      .min(1, { message: t('General.required', { param: 'slug' }) }),
    weight: z
      .string({ message: t('General.required', { param: 'weight' }) })
      .min(1, { message: t('General.required', { param: 'weight' }) }),
    rate: z
      .number({ message: t('Product.rate') })
      .int()
      .positive({ message: t('Product.rate') }),
    description: z
      .string({ message: t('General.required', { param: 'description' }) })
      .min(1, { message: t('General.required', { param: 'description' }) }),
    imageSrc: z.string().regex(/^\/images\/products\/[^\/]+\.jpg$/, {
      message: t('Product.imageSrc'),
    }),
  });

export type CreateProductSchema = z.infer<
  ReturnType<typeof createProductSchema>
>;
