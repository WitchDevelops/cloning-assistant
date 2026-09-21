import { z } from 'zod';
import { isConcentration, isVolume, UNIT_VALUES, UNITS } from '../units';

export const dilutionInputSchema = z
	.object({
		stockConcValue: z.coerce.number().positive(),
		stockConcUnit: z.enum(UNIT_VALUES),
		finalConcValue: z.coerce.number().positive(),
		finalConcUnit: z.enum(UNIT_VALUES),
		finalVolumeValue: z.coerce.number().positive(),
		finalVolumeUnit: z.enum(UNIT_VALUES),
	})
	.refine((data) => isConcentration(data.stockConcUnit), {
		path: ['stockConcUnit'],
		message: 'Stock concentration must be expressed in concentration units.',
	})
	.refine((data) => isConcentration(data.finalConcUnit), {
		path: ['finalConcUnit'],
		message: 'Final concentration must be expressed in concentration units.',
	})
	.refine((data) => isVolume(data.finalVolumeUnit), {
		path: ['finalVolumeUnit'],
		message: 'Final volume must be expressed in volume units.',
	})
	.refine((data) => UNITS[data.finalConcUnit] === UNITS[data.stockConcUnit], {
		path: ['finalConcUnit'],
		message: 'Unit families must match.',
	})
	.refine((data) => data.finalConcValue < data.stockConcValue, {
		path: ['finalConcValue'],
		message: 'Final concentration must be lower than stock concentration.',
	});
