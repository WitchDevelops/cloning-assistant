import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';
import '@/styles/form-control.css';
import './RatioField.css';

type RatioFieldProps<T extends FieldValues> = {
	field: Path<T>;
	label: string;
	presets: readonly number[];
	suffix?: string;
	register: UseFormRegister<T>;
	error?: string;
};

export const RatioField = <T extends FieldValues>({
	field,
	label,
	presets,
	suffix,
	register,
	error,
}: RatioFieldProps<T>) => {
	const errorId = `${field}-error`;
	return (
		<div className="ratio-field">
			<div className="ratio-field__wrapper">
				<label htmlFor={field} className="sr-only">
					{label}
				</label>
				{suffix ? (
					<span aria-hidden="true" className="form-control ratio-field__suffix">
						{suffix}
					</span>
				) : (
					''
				)}
				<select
					id={field}
					{...register(field)}
					className="ratio-field__select form-control form-control--select"
					aria-describedby={errorId}
					aria-invalid={error ? true : undefined}
				>
					{presets.map((preset_ratio) => (
						<option key={preset_ratio} value={preset_ratio}>
							{`${preset_ratio} : 1`}
						</option>
					))}
				</select>
			</div>
			<p id={errorId} aria-live="polite" className="form-control__error">
				{error}
			</p>
		</div>
	);
};
