import { describe, expect, it } from 'vitest';
import { roundToPipette } from './roundToPipette';

describe('roundToPipette', () => {
	it('rounds and flags a value below the 0.5 µL floor', () => {
		expect(roundToPipette(0.34)).toEqual({ microliters: 0.3, warning: true });
	});

	it('rounds a near-zero value down to zero and still warns', () => {
		expect(roundToPipette(0.02)).toEqual({ microliters: 0, warning: true });
	});

	it('does not warn exactly at the 0.5 µL floor', () => {
		expect(roundToPipette(0.5)).toEqual({ microliters: 0.5, warning: false });
	});

	it('rounds to 0.1 µL between 0.5 and 10 µL', () => {
		expect(roundToPipette(3.27)).toEqual({ microliters: 3.3, warning: false });
	});

	it('moves to whole-µL rounding exactly at 10 µL', () => {
		expect(roundToPipette(10)).toEqual({ microliters: 10, warning: false });
	});

	it('rounds to the nearest whole µL between 10 and 200 µL', () => {
		expect(roundToPipette(45.6)).toEqual({ microliters: 46, warning: false });
	});

	it('moves to 0.1 mL (100 µL) rounding exactly at 200 µL', () => {
		expect(roundToPipette(200)).toEqual({ microliters: 200, warning: false });
	});

	it('rounds to the nearest 100 µL above 200 µL', () => {
		expect(roundToPipette(530)).toEqual({ microliters: 500, warning: false });
	});

	it('rounds a large volume to the nearest 0.1 mL', () => {
		expect(roundToPipette(12_345)).toEqual({
			microliters: 12_300,
			warning: false,
		});
	});

	it('does not introduce floating-point drift when a value is already on-increment', () => {
		expect(roundToPipette(3.3).microliters).toBe(3.3);
	});
});
