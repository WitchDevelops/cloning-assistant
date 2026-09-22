import type { ChangeEvent } from 'react';
import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import type { UnitOptions } from '../../features/calculators/utils/units';
import './QuantityField.css';

// Strips anything but digits and a single decimal point, keeping only the first "."
const sanitizeDecimal = (value: string): string => {
	const cleaned = value.replace(/[^\d.]/g, '');
	const firstDot = cleaned.indexOf('.');
	if (firstDot === -1) return cleaned;
	return (
		cleaned.slice(0, firstDot + 1) +
		cleaned.slice(firstDot + 1).replace(/\./g, '')
	);
};

type QuantityFieldProps<T extends FieldValues> = {
	// Path<T> means a valid key of the form values, catches typos
	valueField: Path<T>;
	unitField: Path<T>;
	label: string;
	unitOptions: UnitOptions;
	register: UseFormRegister<T>;
	valueError?: string;
	unitError?: string;
	placeholder?: string;
};

export const QuantityField = <T extends FieldValues>({
	valueField,
	unitField,
	label,
	unitOptions,
	register,
	valueError,
	unitError,
	placeholder,
}: QuantityFieldProps<T>) => {
	const valueErrorId = `${valueField}-error`;
	const unitErrorId = `${unitField}-error`;

	const { onChange: onValueChange, ...valueRegister } = register(valueField);

	const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
		event.target.value = sanitizeDecimal(event.target.value);
		onValueChange(event);
	};

	return (
		<div className="quantity-field">
			<div className="quantity-field__wrapper">
				<label htmlFor={valueField} className="sr-only">
					{`${label} value`}
				</label>
				<input
					id={valueField}
					{...valueRegister}
					onChange={handleValueChange}
					type="text"
					inputMode="decimal"
					className="quantity-field__input"
					placeholder={placeholder}
					aria-describedby={valueErrorId}
					aria-invalid={valueError ? true : undefined}
				/>

				<label htmlFor={unitField} className="sr-only">
					{`${label} unit`}
				</label>
				<select
					id={unitField}
					{...register(unitField)}
					className="quantity-field__select"
					aria-describedby={unitErrorId}
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
			<p id={valueErrorId} aria-live="polite" className="quantity-field__error">
				{valueError}
			</p>
			<p id={unitErrorId} aria-live="polite" className="quantity-field__error">
				{unitError}
			</p>
		</div>
	);
};
