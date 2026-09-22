import { describe, expect, it } from 'vitest';
import { formatVolume } from './formatVolume';

describe('formatVolume', () => {
	it('keeps small volumes in µL', () => {
		expect(formatVolume(100)).toEqual({ value: 100, unit: 'µL' });
	});

	it('keeps zero in µL', () => {
		expect(formatVolume(0)).toEqual({ value: 0, unit: 'µL' });
	});

	it('stays in µL just below the 1000 µL threshold', () => {
		expect(formatVolume(999)).toEqual({ value: 999, unit: 'µL' });
	});

	it('switches to mL exactly at the 1000 µL threshold', () => {
		expect(formatVolume(1000)).toEqual({ value: 1, unit: 'mL' });
	});

	it('converts large volumes to mL', () => {
		expect(formatVolume(10_000)).toEqual({ value: 10, unit: 'mL' });
	});

	it('preserves fractional mL values', () => {
		expect(formatVolume(1500)).toEqual({ value: 1.5, unit: 'mL' });
	});
});
