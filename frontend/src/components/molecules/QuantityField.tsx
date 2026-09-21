import type { UnitOptions } from '../../features/calculators/units';
import './QuantityField.css';

type QuantityFieldProps = {
	name: string;
	unitOptions: UnitOptions;
	error?: string;
	invalid?: boolean;
};

export const QuantityField = ({
	name,
	unitOptions,
	error,
	invalid,
}: QuantityFieldProps) => {
	const valueId = `${name}Value`;
	const unitId = `${name}Unit`;
	const errorId = `${valueId}-error`;

	return (
		<div className="quantity-field">
			<label htmlFor={valueId} className="sr-only">
				Value
			</label>
			<input
				id={valueId}
				name={valueId}
				type="text"
				inputMode="decimal"
				className="quantity-field__input"
				aria-describedby={errorId}
				aria-invalid={invalid}
			/>

			<label htmlFor={unitId} className="sr-only">
				Unit
			</label>
			<select id={unitId} name={unitId} className="quantity-field__select">
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
			<p id={errorId} aria-live="polite" className="quantity-field__error">
				{error}
			</p>
		</div>
	);
};
