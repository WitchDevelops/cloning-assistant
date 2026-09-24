import { describe, expect, it } from 'vitest';
import cases from '../../../contracts/stock-cases.json';
import { stockSchema } from './stock-solutions';

describe('stockSchema matches the shared contract', () => {
	it.each(cases)(`$description`, ({ input, valid }) => {
		expect(stockSchema.safeParse(input).success).toBe(valid);
	});
});
