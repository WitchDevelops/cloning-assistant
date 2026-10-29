import z from 'zod';
import {
	DNA_LENGTH_UNIT_VALUES,
	DNA_MASS_UNIT_VALUES,
	MASS_PER_VOL_CONCENTRATION_UNIT_VALUES,
	VOLUME_UNIT_VALUES,
} from '../utils/units';

export const MOLAR_RATIO_PRESETS = [1, 3, 5, 10] as const;
export const DEFAULT_MOLAR_RATIO: (typeof MOLAR_RATIO_PRESETS)[number] = 3;

export const ligationInputSchema = z.object({
	vectorLengthValue: z.coerce.number().positive(),
	vectorLengthUnit: z.enum(DNA_LENGTH_UNIT_VALUES, {
		error: 'Vector length must be expressed in DNA/RNA length unit.',
	}),
	vectorConcValue: z.coerce.number().positive(),
	vectorConcUnit: z.enum(MASS_PER_VOL_CONCENTRATION_UNIT_VALUES, {
		error:
			'Vector concentration must be expressed in a mass per volume concentration unit.',
	}),
	vectorMassValue: z.coerce.number().positive(),
	vectorMassUnit: z.enum(DNA_MASS_UNIT_VALUES, {
		error: 'Vector mass must be given in DNA/RNA mass units.',
	}),
	insertLengthValue: z.coerce.number().positive(),
	insertLengthUnit: z.enum(DNA_LENGTH_UNIT_VALUES, {
		error: 'Insert length must be expressed in DNA/RNA length unit.',
	}),
	insertConcValue: z.coerce.number().positive(),
	insertConcUnit: z.enum(MASS_PER_VOL_CONCENTRATION_UNIT_VALUES, {
		error:
			'Insert concentration must be expressed in a mass per volume concentration unit.',
	}),
	molarRatio: z.coerce.number().positive(),
	finalVolumeValue: z.coerce.number().positive(),
	finalVolumeUnit: z.enum(VOLUME_UNIT_VALUES, {
		error: 'Final reaction volume must be given in a volume unit.',
	}),
});

export type LigationInput = z.output<typeof ligationInputSchema>;
export type LigationFormValues = z.input<typeof ligationInputSchema>;
