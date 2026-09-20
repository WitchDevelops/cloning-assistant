import type { UnitOptions } from '../../features/calculators/units';

type QuantityFieldProps = {
	name: string;
	unitOptions: UnitOptions;
	errorId?: string;
	invalid?: boolean;
};

export const QuantityField = ({
	name,
	unitOptions,
	errorId,
	invalid,
}: QuantityFieldProps) => {
	const valueId = `${name}Value`;
	const unitId = `${name}Unit`;

	return (
		<>
			<label htmlFor={valueId} className="sr-only">
				Value
			</label>
			<input
				id={valueId}
				name={valueId}
				type="text"
				inputMode="decimal"
				aria-describedby={errorId}
				aria-invalid={invalid}
			/>

			<label htmlFor={unitId} className="sr-only">
				Unit
			</label>
			<select id={unitId} name={unitId}>
				{unitOptions.kind === 'grouped'
					? unitOptions.groups.map(({ key, label, units }) => (
							<optgroup key={key} label={label}>
								{units.map((u) => (
									<option key={u} value={u}>
										{u}
									</option>
								))}
							</optgroup>
						))
					: unitOptions.units.map((unit) => (
							<option key={unit} value={unit}>
								{unit}
							</option>
						))}
			</select>
		</>
	);
};
