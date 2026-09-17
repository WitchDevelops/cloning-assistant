import { describe, expect, it } from 'vitest';
import { dilutionInputSchema } from './dilutionSchema';

const valid = { stockConc: 100, finalConc: 10, finalVolume: 500 };

describe('dilutionInputSchema', () => {
	it('accepts valid input', () => {
		expect(dilutionInputSchema.safeParse(valid).success).toBe(true);
	});
	it('rejects negative stock concentration', () => {
		const negStockConc = dilutionInputSchema.safeParse({
			...valid,
			stockConc: -1,
		});
		expect(negStockConc.success).toBe(false);
	});
});
