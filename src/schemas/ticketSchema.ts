import { z } from 'zod'

export const ticketSchema = z.object({
  content: z
    .string()
    .min(30, { message: 'Content must be at least 30 characters.' })
    .max(500, { message: 'Content must not be longer than 500 characters.' }),
});
