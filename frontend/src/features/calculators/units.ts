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

export const UNIT_VALUES = Object.keys(UNITS) as Unit[];

export const isConcentration = (unit: Unit): boolean =>
	CONCENTRATION_FAMILIES.includes(UNITS[unit]);

export const isVolume = (unit: Unit): boolean => UNITS[unit] === 'volume';

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
};

export const VOLUME_UNITS: UnitOptions = {
	kind: 'flat',
	units: unitsOf('volume'),
};
