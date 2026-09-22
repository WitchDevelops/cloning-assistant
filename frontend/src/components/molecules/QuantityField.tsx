import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import type { UnitOptions } from '../../features/calculators/units';
import './QuantityField.css';

type QuantityFieldProps<T extends FieldValues> = {
	// Path<T> means a valid key of the form values, catches typos
	valueField: Path<T>;
	unitField: Path<T>;
	unitOptions: UnitOptions;
	register: UseFormRegister<T>;
	valueError?: string;
	unitError?: string;
};

export const QuantityField = <T extends FieldValues>({
	valueField,
	unitField,
	unitOptions,
	register,
	valueError,
	unitError,
}: QuantityFieldProps<T>) => {
	const errorId = `${valueField}-error`;
	const error = valueError ?? unitError;

	return (
		<div className="quantity-field">
			<div className="quantity-field__wrapper">
				<label htmlFor={valueField} className="sr-only">
					Value
				</label>
				<input
					id={valueField}
					{...register(valueField)}
					type="text"
					inputMode="decimal"
					className="quantity-field__input"
					aria-describedby={errorId}
					aria-invalid={valueError ? true : undefined}
				/>

				<label htmlFor={unitField} className="sr-only">
					Unit
				</label>
				<select
					id={unitField}
					{...register(unitField)}
					className="quantity-field__select"
					aria-describedby={errorId}
					aria-invalid={unitError ? true : undefined}
				>
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
			</div>
			<p id={errorId} aria-live="polite" className="quantity-field__error">
				{error}
			</p>
		</div>
	);
};
