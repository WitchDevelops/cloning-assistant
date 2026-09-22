import { z } from 'zod';
import {
	CONCENTRATION_UNIT_VALUES,
	toBase,
	UNITS,
	VOLUME_UNIT_VALUES,
} from '../utils/units';

export const dilutionInputSchema = z
	.object({
		stockConcValue: z.coerce.number().positive(),
		stockConcUnit: z.enum(CONCENTRATION_UNIT_VALUES, {
			error: 'Stock concentration must be expressed in a concentration unit.',
		}),
		finalConcValue: z.coerce.number().positive(),
		finalConcUnit: z.enum(CONCENTRATION_UNIT_VALUES, {
			error: 'Working concentration must be expressed in a concentration unit.',
		}),
		finalVolumeValue: z.coerce.number().positive(),
		finalVolumeUnit: z.enum(VOLUME_UNIT_VALUES, {
			error: 'Final volume must be expressed in a volume unit.',
		}),
	})
	.superRefine((data, ctx) => {
		if (UNITS[data.finalConcUnit].family !== UNITS[data.stockConcUnit].family) {
			ctx.addIssue({
				code: 'custom',
				path: ['finalConcUnit'],
				message: 'Unit families must match.',
			});
			// magnitude comparison is meaningless across families, so stop here
			return;
		}

		if (
			toBase(data.finalConcValue, data.finalConcUnit) >=
			toBase(data.stockConcValue, data.stockConcUnit)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['finalConcValue'],
				message: 'Final concentration must be lower than stock concentration.',
			});
		}
	});

export type DilutionInput = z.output<typeof dilutionInputSchema>;
export type DilutionFormValues = z.input<typeof dilutionInputSchema>;
