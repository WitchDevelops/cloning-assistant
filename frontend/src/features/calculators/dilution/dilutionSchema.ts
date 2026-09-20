import { z } from 'zod';

export const dilutionInputSchema = z
	.object({
		stockConcValue: z.coerce.number().positive(),
		finalConcValue: z.coerce.number().positive(),
		finalVolumeValue: z.coerce.number().positive(),
	})
	.refine((data) => data.finalConcValue < data.stockConcValue, {
		path: ['finalConc'],
		message:
			'Final concentration cannot be higer than the stock concentration.',
	});
