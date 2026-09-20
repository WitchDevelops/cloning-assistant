import { Button } from '../../components/atoms/Button';

const CONCENTRATION_UNITS = [
	{
		key: 'massPerVolume',
		label: 'Mass per volume',
		units: ['ng/µL', 'µg/µL', 'mg/mL'],
	},
	{ key: 'molar', label: 'Molar', units: ['nM', 'µM', 'mM', 'M'] },
] as const;

const VOLUME_UNITS = ['µL', 'mL'];

export const Calculators = () => {
	return (
		<div className="calculators__card">
			<h2>Diluting stock</h2>
			<form className="calculators__card__form">
				<div className="form__body">
					<fieldset className="form__group">
						<legend>Stock concentration</legend>
						<label htmlFor="stockConcValue" className="sr-only">
							Value
						</label>
						<input
							id="stockConcValue"
							name="stockConc"
							type="number"
							step="any"
						/>
						<label htmlFor="stockConcUnit" className="sr-only">
							Unit
						</label>
						<select id="stockConcUnit" name="stockConcUnit">
							{CONCENTRATION_UNITS.map(({ key, label, units }) => (
								<optgroup key={key} label={label}>
									{units.map((u) => (
										<option key={u} value={u}>
											{u}
										</option>
									))}
								</optgroup>
							))}
						</select>
					</fieldset>
					<fieldset className="form__group">
						<legend>Working concentration</legend>
						<label htmlFor="finalConcValue" className="sr-only">
							Value
						</label>
						<input
							id="finalConcValue"
							name="finalConc"
							type="number"
							step="any"
						/>
						<label htmlFor="finalConcUnit" className="sr-only">
							Unit
						</label>
						<select id="finalConcUnit" name="finalConcUnit">
							{CONCENTRATION_UNITS.map(({ key, label, units }) => (
								<optgroup key={key} label={label}>
									{units.map((u) => (
										<option key={u} value={u}>
											{u}
										</option>
									))}
								</optgroup>
							))}
						</select>
					</fieldset>
					<fieldset className="form__group">
						<legend>Final volume</legend>
						<label htmlFor="finalVolumeValue" className="sr-only">
							Value
						</label>
						<input
							id="finalVolumeValue"
							name="finalVolume"
							type="number"
							step="any"
						/>
						<label htmlFor="finalVolumeUnit" className="sr-only">
							Unit
						</label>
						<select id="finalVolumeUnit" name="finalVolumeUnit">
							{VOLUME_UNITS.map((unit) => (
								<option key={unit}>{unit}</option>
							))}
						</select>
					</fieldset>
				</div>
				<div className="form__submit">
					<Button className="submit__button">Calculate</Button>
				</div>
			</form>
		</div>
	);
};
