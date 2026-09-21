import { describe, expect, it } from 'vitest';
import { dilutionInputSchema } from './dilutionSchema';

const valid = {
	stockConcValue: 100,
	stockConcUnit: 'mM',
	finalConcValue: 10,
	finalConcUnit: 'mM',
	finalVolumeValue: 500,
	finalVolumeUnit: 'µL',
};

const rejectionPaths = (input: unknown): string[] => {
	const result = dilutionInputSchema.safeParse(input);
	return result.success ? [] : result.error.issues.map((i) => i.path.join('.'));
};

describe('dilutionInputSchema', () => {
	it('accepts valid input', () => {
		expect(dilutionInputSchema.safeParse(valid).success).toBe(true);
	});

	it('rejects negative stock concentration', () => {
		expect(rejectionPaths({ ...valid, stockConcValue: -1 })).toContain(
			'stockConcValue',
		);
	});

	it('rejects a final concentration at or above the stock concentration', () => {
		expect(rejectionPaths({ ...valid, finalConcValue: 200 })).toContain(
			'finalConcValue',
		);
	});

	it('rejects a volume unit where a concentration is required', () => {
		expect(rejectionPaths({ ...valid, stockConcUnit: 'µL' })).toContain(
			'stockConcUnit',
		);
	});

	it('rejects a concentration unit where a volume is required', () => {
		expect(rejectionPaths({ ...valid, finalVolumeUnit: 'mM' })).toContain(
			'finalVolumeUnit',
		);
	});

	it('accepts concentrations in different units of the same family', () => {
		expect(
			dilutionInputSchema.safeParse({ ...valid, finalConcUnit: 'µM' }).success,
		).toBe(true);
	});

	it('rejects concentrations from different unit families', () => {
		expect(rejectionPaths({ ...valid, stockConcUnit: 'mg/mL' })).toContain(
			'finalConcUnit',
		);
	});

	it('rejects a unit outside the known set', () => {
		expect(rejectionPaths({ ...valid, stockConcUnit: 'pM' })).toContain(
			'stockConcUnit',
		);
	});

	it('rejects a final concentration higher than the stock in another unit', () => {
		expect(
			rejectionPaths({ ...valid, stockConcUnit: 'nM', finalConcUnit: 'µM' }),
		).toContain('finalConcValue');
	});
});
