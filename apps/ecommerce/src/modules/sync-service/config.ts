import { z } from 'zod';

export const syncServiceConfigSchema = z.object({
    baseUrl: z.string().transform((value) => value.replace(/\/+$/, '')),
    token: z.string().optional(),
});

export type SyncServiceConfig = z.infer<typeof syncServiceConfigSchema>;
