import type { Quantity, VolumeUnit } from './units';

/** Picks the friendlier display unit for a volume given in µL (100 -> µL, 10_000 -> 10 mL). */
export const formatVolume = (microliters: number): Quantity<VolumeUnit> => {
	if (microliters >= 1000) {
		return { value: microliters / 1000, unit: 'mL' };
	}
	return { value: microliters, unit: 'µL' };
};
