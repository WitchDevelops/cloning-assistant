import contract from '@contracts/units.json';
import { describe, expect, it } from 'vitest';
import { UNITS } from './units';

describe('unit contract', () => {
	it('matches the backend unit table', () => {
		expect(UNITS).toEqual(contract);
	});
});
