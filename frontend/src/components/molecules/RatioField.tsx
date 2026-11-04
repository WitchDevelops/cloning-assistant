import type { FieldValues, Path, UseFormRegister } from 'react-hook-form';

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
	return (
		<div className="ratio-field">
			<div className="ratio-field__wrapper">
				<label htmlFor={field} className="sr-only">
					{label}
				</label>
				<select
					id={field}
					{...register(field)}
					className="ratio-field__select"
					aria-describedby={error}
					aria-invalid={error ? true : undefined}
				>
					{presets.map((preset_ratio) => (
						<option key={preset_ratio} value={preset_ratio}>
							{`${preset_ratio} : 1`}
						</option>
					))}
				</select>
				{suffix ? <span aria-hidden="true">{suffix}</span> : ''}
			</div>
			<p aria-live="polite" className="ratio-field__error">
				{error}
			</p>
		</div>
	);
};
