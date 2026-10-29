import { describe, expect, it } from 'vitest';
import type { LigationInput } from './ligationSchema';
import { toLigationRequest } from './toLigationRequest';

const input: LigationInput = {
	vectorLengthValue: 4,
	vectorLengthUnit: 'kb',
	vectorConcValue: 100,
	vectorConcUnit: 'ng/µL',
	vectorMassValue: 50,
	vectorMassUnit: 'ng',
	insertLengthValue: 1200,
	insertLengthUnit: 'bp',
	insertConcValue: 20,
	insertConcUnit: 'ng/µL',
	molarRatio: 3,
	finalVolumeValue: 20,
	finalVolumeUnit: 'µL',
};

describe('toLigationRequest', () => {
	it('maps each form field to its nested quantity', () => {
		expect(toLigationRequest(input)).toEqual({
			vectorLength: { value: 4, unit: 'kb' },
			vectorConc: { value: 100, unit: 'ng/µL' },
			vectorMass: { value: 50, unit: 'ng' },
			insertLength: { value: 1200, unit: 'bp' },
			insertConc: { value: 20, unit: 'ng/µL' },
			molarRatio: 3,
			finalVolume: { value: 20, unit: 'µL' },
		});
	});

	it('rejects a molar unit in a concentration slot', () => {
		// @ts-expect-error - nM is excluded by the schema, so LigationInput does not allow it
		toLigationRequest({ ...input, vectorConcUnit: 'nM' });
	});
});
