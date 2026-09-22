// Pipettes don't aspirate small volumes reliably and are often not calibrated well enough
// round the calculation to reasonable values
// value (µL) | rounding | flag
// < 0.5      | → 0.1 µL | warning
// 0.5 – <10  | → 0.1 µL | —
// 10 – <200 | → 1 µL    | —
// ≥ 200     |→ 0.1 mL (100 µL)	—

export type PipetteRounding = {
	microliters: number;
	warning: boolean;
};

const roundToIncrement = (value: number, increment: number): number =>
	Math.round(Math.round(value / increment) * increment * 1e6) / 1e6;

export const roundToPipette = (microliters: number): PipetteRounding => {
	if (microliters < 0.5) {
		return { microliters: roundToIncrement(microliters, 0.1), warning: true };
	}
	if (microliters < 10) {
		return { microliters: roundToIncrement(microliters, 0.1), warning: false };
	}
	if (microliters < 200) {
		return { microliters: roundToIncrement(microliters, 1), warning: false };
	}
	return { microliters: roundToIncrement(microliters, 100), warning: false };
};
