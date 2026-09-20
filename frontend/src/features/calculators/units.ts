export type UnitGroup = {
	key: string;
	label: string;
	units: readonly string[];
};

export type UnitOptions =
	| { kind: 'flat'; units: readonly string[] }
	| { kind: 'grouped'; groups: readonly UnitGroup[] };

export const CONCENTRATION_UNITS = {
	kind: 'grouped',
	groups: [
		{
			key: 'massPerVolume',
			label: 'Mass per volume',
			units: ['ng/µL', 'µg/µL', 'mg/mL'],
		},
		{ key: 'molar', label: 'Molar', units: ['nM', 'µM', 'mM', 'M'] },
	],
} as const satisfies UnitOptions;

export const VOLUME_UNITS = {
	kind: 'flat',
	units: ['µL', 'mL'],
} as const satisfies UnitOptions;
