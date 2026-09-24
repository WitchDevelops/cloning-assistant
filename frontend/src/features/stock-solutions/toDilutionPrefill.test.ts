import { describe, expect, it } from 'vitest';
import type { StockSolution } from '../../api/stock-solutions';
import { toDilutionPrefill } from './toDilutionPrefill';

const emptyStock: StockSolution = {
	name: 'Empty Buffer',
	composition: {},
	concentrationFactor: null,
	ph: null,
	note: null,
	citation: null,
};

const simpleStock: StockSolution = {
	name: 'Tris-HCl',
	composition: {
		'Tris-HCl': { value: 100, unit: 'mM' },
	},
	concentrationFactor: null,
	ph: null,
	note: null,
	citation: null,
};

const compositeStock: StockSolution = {
	name: 'TE Buffer 5x',
	composition: {
		Tris: { value: 50, unit: 'mM' },
		EDTA: { value: 5, unit: 'mM' },
	},
	concentrationFactor: 5,
	ph: null,
	note: null,
	citation: null,
};

const unevenFactorStock: StockSolution = {
	name: 'Test Buffer 6x',
	composition: {
		Component: { value: 100, unit: 'mM' },
	},
	concentrationFactor: 6,
	ph: null,
	note: null,
	citation: null,
};

describe('toDilutionPrefill', () => {
	it('returns an empty object when composition has no entries', () => {
		expect(toDilutionPrefill(emptyStock)).toEqual({});
	});

	it('prefills the stock concentration from the first composition entry', () => {
		expect(toDilutionPrefill(simpleStock)).toEqual({
			stockConcValue: '100',
			stockConcUnit: 'mM',
		});
	});

	it('also prefills the final concentration when a concentrationFactor is set', () => {
		expect(toDilutionPrefill(compositeStock)).toEqual({
			stockConcValue: '50',
			stockConcUnit: 'mM',
			finalConcValue: '10',
			finalConcUnit: 'mM',
		});
	});

	// for now, usually the composite buffers come in concentrations that do divide evenly
	it('does not round the final concentration when the factor divides unevenly', () => {
		expect(toDilutionPrefill(unevenFactorStock)).toEqual({
			stockConcValue: '100',
			stockConcUnit: 'mM',
			finalConcValue: String(100 / 6),
			finalConcUnit: 'mM',
		});
	});
});
