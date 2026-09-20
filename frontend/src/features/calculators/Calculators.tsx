import { Button } from '../../components/atoms/Button';
import { Fieldset } from '../../components/molecules/Fieldset';
import { QuantityField } from '../../components/molecules/QuantityField';
import { CONCENTRATION_UNITS, VOLUME_UNITS } from './units';
import './Calculators.css';

export const Calculators = () => {
	return (
		<div className="calculators__card">
			<h2 className="card__title">Diluting stock</h2>
			<form className="calculators__form">
				<div className="form__body">
					<Fieldset legend="Stock concentration">
						<QuantityField name="stockConc" unitOptions={CONCENTRATION_UNITS} />
					</Fieldset>
					<Fieldset legend="Working concentration">
						<QuantityField name="finalConc" unitOptions={CONCENTRATION_UNITS} />
					</Fieldset>
					<Fieldset legend="Final volume">
						<QuantityField name="finalVolume" unitOptions={VOLUME_UNITS} />
					</Fieldset>
				</div>
				<div className="form__submit">
					<Button className="submit__button" type="submit">
						Calculate
					</Button>
				</div>
			</form>
		</div>
	);
};
