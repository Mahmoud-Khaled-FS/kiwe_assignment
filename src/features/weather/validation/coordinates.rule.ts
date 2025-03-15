import { z } from 'zod';

export const coordinatesSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  long: z.coerce.number().min(-180).max(180),
});

export type CoordinatesSchema = z.infer<typeof coordinatesSchema>;
