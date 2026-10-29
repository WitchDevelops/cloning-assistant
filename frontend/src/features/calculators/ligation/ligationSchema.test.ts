import { describe, expect, it } from 'vitest';
import { ligationInputSchema } from './ligationSchema';

const withoutRatio = {
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
	finalVolumeValue: 20,
	finalVolumeUnit: 'µL',
};

const valid = { ...withoutRatio, molarRatio: 3 };

const rejectionPaths = (input: unknown): string[] => {
	const result = ligationInputSchema.safeParse(input);
	return result.success ? [] : result.error.issues.map((i) => i.path.join('.'));
};

describe('ligationInputSchema', () => {
	it('accepts valid input', () => {
		expect(ligationInputSchema.safeParse(valid).success).toBe(true);
	});

	it('rejects non-positive vector mass', () => {
		expect(rejectionPaths({ ...valid, vectorMassValue: 0 })).toContain(
			'vectorMassValue',
		);
	});

	it('rejects a vector mass unit that is not a DNA mass unit', () => {
		expect(rejectionPaths({ ...valid, vectorMassUnit: 'bp' })).toContain(
			'vectorMassUnit',
		);
	});

	it('rejects a molar unit for vector concentration', () => {
		expect(rejectionPaths({ ...valid, vectorConcUnit: 'nM' })).toContain(
			'vectorConcUnit',
		);
	});

	it('rejects a molar unit for insert concentration', () => {
		expect(rejectionPaths({ ...valid, insertConcUnit: 'µM' })).toContain(
			'insertConcUnit',
		);
	});

	it('rejects vector length unit that is not bp or kb', () => {
		expect(rejectionPaths({ ...valid, vectorLengthUnit: 'ng' })).toContain(
			'vectorLengthUnit',
		);
	});

	it('rejects a unit outside the known set', () => {
		expect(rejectionPaths({ ...valid, finalVolumeUnit: 'nL' })).toContain(
			'finalVolumeUnit',
		);
	});

	it('rejects a missing molar ratio', () => {
		expect(rejectionPaths(withoutRatio)).toContain('molarRatio');
	});

	it('rejects a non-positive molar ratio', () => {
		expect(rejectionPaths({ ...valid, molarRatio: 0 })).toContain('molarRatio');
	});

	it('accepts a custom molar ratio outside the presets', () => {
		expect(
			ligationInputSchema.safeParse({ ...valid, molarRatio: 2 }).success,
		).toBe(true);
	});
});
