import z from 'zod';
import type {
	DNALengthUnit,
	DNAMassUnit,
	MassConcentrationUnit,
	Quantity,
	VolumeUnit,
} from '@/features/calculators/utils/units';
import { type ApiResult, api } from './client';

const ligationReactionResponseSchema = z.object({
	vectorVolume: z.number().positive(),
	insertVolume: z.number().nonnegative(),
	ligaseVolume: z.number().positive(),
	ligaseBufferVolume: z.number().positive(),
	waterVolume: z.number().nonnegative(),
});

const ligationResponseSchema = z.object({
	insertMass: z.number().positive(),
	reaction: ligationReactionResponseSchema,
	control: ligationReactionResponseSchema,
});

export type LigationResponse = z.infer<typeof ligationResponseSchema>;

export type LigationRequest = {
	vectorLength: Quantity<DNALengthUnit>;
	vectorConc: Quantity<MassConcentrationUnit>;
	vectorMass: Quantity<DNAMassUnit>;
	insertLength: Quantity<DNALengthUnit>;
	insertConc: Quantity<MassConcentrationUnit>;
	molarRatio: number;
	finalVolume: Quantity<VolumeUnit>;
};

export const postLigation = (
	body: LigationRequest,
): Promise<ApiResult<LigationResponse>> => {
	return api.post('/api/ligation', body, ligationResponseSchema);
};
