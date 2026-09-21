import { describe, expect, it } from 'vitest';
import { dilutionInputSchema } from './dilutionSchema';

const valid = {
	stockConcValue: 100,
	finalConcValue: 10,
	finalVolumeValue: 500,
};

describe('dilutionInputSchema', () => {
	it('accepts valid input', () => {
		expect(dilutionInputSchema.safeParse(valid).success).toBe(true);
	});
	it('rejects negative stock concentration', () => {
		const negStockConc = dilutionInputSchema.safeParse({
			...valid,
			stockConcValue: -1,
		});
		expect(negStockConc.success).toBe(false);
	});
});
