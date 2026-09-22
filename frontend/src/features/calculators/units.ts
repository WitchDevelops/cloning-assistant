export type Unit = keyof typeof UNITS;
export type UnitFamily = (typeof UNIT_FAMILIES)[number];

export type UnitGroup = {
	key: UnitFamily;
	label: string;
	units: readonly Unit[];
};

export type UnitOptions =
	| { kind: 'flat'; units: readonly Unit[] }
	| { kind: 'grouped'; groups: readonly UnitGroup[] };

export const UNIT_FAMILIES = [
	'massPerVolume',
	'molPerVolume',
	'volume',
] as const;

export const CONCENTRATION_FAMILIES: readonly UnitFamily[] = [
	'massPerVolume',
	'molPerVolume',
];

export const UNITS = {
	'ng/µL': { family: 'massPerVolume', factor: 1 },
	'µg/µL': { family: 'massPerVolume', factor: 1_000 },
	'mg/mL': { family: 'massPerVolume', factor: 1_000 },
	nM: { family: 'molPerVolume', factor: 1 },
	µM: { family: 'molPerVolume', factor: 1_000 },
	mM: { family: 'molPerVolume', factor: 1_000_000 },
	M: { family: 'molPerVolume', factor: 1_000_000_000 },
	µL: { family: 'volume', factor: 1 },
	mL: { family: 'volume', factor: 1_000 },
} as const satisfies Record<string, { family: UnitFamily; factor: number }>;

export const UNIT_VALUES = Object.keys(UNITS) as Unit[];

/** Converts a quantity to the base unit of its family: ng/µL, nM or µL. */
export const toBase = (value: number, unit: Unit): number =>
	value * UNITS[unit].factor;

export const isConcentration = (unit: Unit): unit is ConcentrationUnit =>
	CONCENTRATION_FAMILIES.includes(UNITS[unit].family);

export const isVolume = (unit: Unit): unit is VolumeUnit =>
	UNITS[unit].family === 'volume';

export const CONCENTRATION_UNIT_VALUES = UNIT_VALUES.filter(isConcentration);
export const VOLUME_UNIT_VALUES = UNIT_VALUES.filter(isVolume);

const unitsOf = (family: UnitFamily): Unit[] =>
	(Object.keys(UNITS) as Unit[]).filter(
		(unit) => UNITS[unit].family === family,
	);

const FAMILY_LABELS: Record<UnitFamily, string> = {
	massPerVolume: 'Mass per volume',
	molPerVolume: 'Mol per volume',
	volume: 'Volume',
};

export const CONCENTRATION_UNITS: UnitOptions = {
	kind: 'grouped',
	groups: CONCENTRATION_FAMILIES.map((family) => ({
		key: family,
		label: FAMILY_LABELS[family],
		units: unitsOf(family),
	})),
};

export const VOLUME_UNITS: UnitOptions = {
	kind: 'flat',
	units: unitsOf('volume'),
};

type UnitOf<F extends UnitFamily> = {
	[K in Unit]: (typeof UNITS)[K]['family'] extends F ? K : never;
}[Unit];

export type ConcentrationUnit = UnitOf<'massPerVolume' | 'molPerVolume'>;
export type VolumeUnit = UnitOf<'volume'>;

// Generic with a default so that narrowing to Quantity<VolumeUnit> works
export type Quantity<U extends Unit = Unit> = {
	value: number;
	unit: U;
};
