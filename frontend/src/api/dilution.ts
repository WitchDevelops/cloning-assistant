import z from 'zod';
import type {
	ConcentrationUnit,
	Quantity,
	VolumeUnit,
} from '../features/calculators/units';
import { type ApiResult, api } from './client';

const dilutionResponseSchema = z.object({
	stock: z.number().positive(),
	diluent: z.number().positive(),
});

export type DilutionResponse = z.infer<typeof dilutionResponseSchema>;

export type DilutionRequest = {
	stockConc: Quantity<ConcentrationUnit>;
	finalConc: Quantity<ConcentrationUnit>;
	finalVolume: Quantity<VolumeUnit>;
};

export const postDilution = (
	body: DilutionRequest,
): Promise<ApiResult<DilutionResponse>> => {
	return api.post('/api/dilution', body, dilutionResponseSchema);
};
