import { z } from 'zod';

export const dilutionInputSchema = z
	.object({
		stockConc: z.coerce.number().positive(),
		finalConc: z.coerce.number().positive(),
		finalVolume: z.coerce.number().positive(),
	})
	.refine((data) => data.finalConc < data.stockConc, {
		path: ['finalConc'],
		message:
			'Final concentration cannot be higer than the stock concentration.',
	});
