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

const CONCENTRATION_FAMILIES = ['massPerVolume', 'molPerVolume'] as const;

export type UnitFamily = (typeof UNIT_FAMILIES)[number];

export const UNITS = {
	'ng/µL': 'massPerVolume',
	'µg/µL': 'massPerVolume',
	'mg/mL': 'massPerVolume',
	nM: 'molPerVolume',
	µM: 'molPerVolume',
	mM: 'molPerVolume',
	M: 'molPerVolume',
	µL: 'volume',
	mL: 'volume',
} as const satisfies Record<string, UnitFamily>;

export type Unit = keyof typeof UNITS;

const unitsOf = (family: UnitFamily): Unit[] =>
	(Object.keys(UNITS) as Unit[]).filter((unit) => UNITS[unit] === family);

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
} as const satisfies UnitOptions;

export const VOLUME_UNITS: UnitOptions = {
	kind: 'flat',
	units: unitsOf('volume'),
} as const satisfies UnitOptions;
