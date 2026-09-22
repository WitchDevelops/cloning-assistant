import { describe, expect, it } from 'vitest';
import type { DilutionInput } from './dilutionSchema';
import { toDilutionRequest } from './toDilutionRequest';

const input: DilutionInput = {
	stockConcValue: 100,
	stockConcUnit: 'mM',
	finalConcValue: 10,
	finalConcUnit: 'µM',
	finalVolumeValue: 500,
	finalVolumeUnit: 'µL',
};

const inputVaried: DilutionInput = {
	stockConcValue: 100,
	stockConcUnit: 'mg/mL',
	finalConcValue: 10,
	finalConcUnit: 'M',
	finalVolumeValue: 500,
	finalVolumeUnit: 'mL',
};

describe('toDilutionRequest', () => {
	it('maps each form field to its nested quantity', () => {
		expect(toDilutionRequest(input)).toEqual({
			stockConc: { value: 100, unit: 'mM' },
			finalConc: { value: 10, unit: 'µM' },
			finalVolume: { value: 500, unit: 'µL' },
		});
	});

	it('passes units through without converting them', () => {
		expect(toDilutionRequest(inputVaried)).toEqual({
			stockConc: { value: 100, unit: 'mg/mL' },
			finalConc: { value: 10, unit: 'M' },
			finalVolume: { value: 500, unit: 'mL' },
		});
	});

	it('rejects a volume unit in a concentration slot', () => {
		// @ts-expect-error - µL is a VolumeUnit, not assignable to Quantity<ConcentrationUnit>
		toDilutionRequest({ ...input, stockConcUnit: 'µL' });
	});
});
