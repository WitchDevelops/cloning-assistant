import type { DilutionRequest } from '../../../api/dilution';
import type { DilutionInput } from './dilutionSchema';

export const toDilutionRequest = (input: DilutionInput): DilutionRequest => ({
	stockConc: { value: input.stockConcValue, unit: input.stockConcUnit },
	finalConc: { value: input.finalConcValue, unit: input.finalConcUnit },
	finalVolume: { value: input.finalVolumeValue, unit: input.finalVolumeUnit },
});
