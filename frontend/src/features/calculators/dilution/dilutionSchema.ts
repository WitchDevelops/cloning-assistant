import { z } from 'zod';
import {
	CONCENTRATION_UNIT_VALUES,
	toBase,
	UNITS,
	VOLUME_UNIT_VALUES,
} from '../units';

export const dilutionInputSchema = z
	.object({
		stockConcValue: z.coerce.number().positive(),
		stockConcUnit: z.enum(CONCENTRATION_UNIT_VALUES),
		finalConcValue: z.coerce.number().positive(),
		finalConcUnit: z.enum(CONCENTRATION_UNIT_VALUES),
		finalVolumeValue: z.coerce.number().positive(),
		finalVolumeUnit: z.enum(VOLUME_UNIT_VALUES),
	})
	.refine(
		(data) =>
			UNITS[data.finalConcUnit].family === UNITS[data.stockConcUnit].family,
		{
			path: ['finalConcUnit'],
			message: 'Unit families must match.',
		},
	)
	.refine(
		(data) =>
			toBase(data.finalConcValue, data.finalConcUnit) <
			toBase(data.stockConcValue, data.stockConcUnit),
		{
			path: ['finalConcValue'],
			message: 'Final concentration must be lower than stock concentration.',
		},
	);

export type DilutionInput = z.output<typeof dilutionInputSchema>;
export type DilutionFormValues = z.input<typeof dilutionInputSchema>;
