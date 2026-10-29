import type { LigationRequest } from '@/api/ligation';
import type { LigationInput } from './ligationSchema';

export const toLigationRequest = (input: LigationInput): LigationRequest => ({
	vectorLength: {
		value: input.vectorLengthValue,
		unit: input.vectorLengthUnit,
	},
	vectorConc: { value: input.vectorConcValue, unit: input.vectorConcUnit },
	vectorMass: { value: input.vectorMassValue, unit: input.vectorMassUnit },
	insertLength: {
		value: input.insertLengthValue,
		unit: input.insertLengthUnit,
	},
	insertConc: { value: input.insertConcValue, unit: input.insertConcUnit },
	molarRatio: input.molarRatio,
	finalVolume: { value: input.finalVolumeValue, unit: input.finalVolumeUnit },
});
