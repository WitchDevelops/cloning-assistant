import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { PageTitle } from '@/components/atoms/PageTitle';
import { Card } from '@/components/molecules/Card';
import { Fieldset } from '@/components/molecules/Fieldset';
import { QuantityField } from '@/components/molecules/QuantityField';
import { RatioField } from '@/components/molecules/RatioField';
import {
	DNA_LENGTH_UNITS,
	DNA_MASS_UNITS,
	MASS_VOLUME_UNITS,
	VOLUME_UNITS,
} from '../utils/units';
import { type LigationFormValues, MOLAR_RATIO_PRESETS } from './ligationSchema';

export const LigationCalculatorPage = () => {
	const { register } = useForm<LigationFormValues>();
	return (
		<>
			<PageTitle title="Ligation calculator" />
			<Card title="Calculate Volumes for Ligation">
				<form className="calculators__form">
					<div className="form__body">
						<Fieldset legend="Vector Data" variant="outlined-group">
							<Fieldset legend="Length">
								<QuantityField
									valueField="vectorLengthValue"
									unitField="vectorLengthUnit"
									label="Vector length"
									unitOptions={DNA_LENGTH_UNITS}
									register={register}
									placeholder="e.g. 3 000"
								/>
							</Fieldset>
							<Fieldset legend="Concentration">
								<QuantityField
									valueField="vectorConcValue"
									unitField="vectorConcUnit"
									label="Vector concentration"
									unitOptions={MASS_VOLUME_UNITS}
									register={register}
									placeholder="e.g. 100"
								/>
							</Fieldset>
							<Fieldset legend="Mass">
								<QuantityField
									valueField="vectorMassValue"
									unitField="vectorMassUnit"
									label="Vector mass"
									unitOptions={DNA_MASS_UNITS}
									register={register}
									placeholder="e.g. 50"
								/>
							</Fieldset>
						</Fieldset>
						<Fieldset legend="Insert Data" variant="outlined-group">
							<Fieldset legend="Length">
								<QuantityField
									valueField="insertLengthValue"
									unitField="insertLengthUnit"
									label="Insert length"
									unitOptions={DNA_LENGTH_UNITS}
									register={register}
									placeholder="e.g. 1 400"
								/>
							</Fieldset>
							<Fieldset legend="Concentration">
								<QuantityField
									valueField="insertConcValue"
									unitField="insertConcUnit"
									label="Insert concentration"
									unitOptions={MASS_VOLUME_UNITS}
									register={register}
									placeholder="e.g. 20"
								/>
							</Fieldset>
						</Fieldset>
						<Fieldset legend="Reaction Parameters" variant="outlined-group">
							<Fieldset legend="Molar Ratio">
								<RatioField
									field="molarRatio"
									label="Molar ratio (insert:vector)"
									presets={MOLAR_RATIO_PRESETS}
									suffix="insert:vector"
									register={register}
								></RatioField>
							</Fieldset>
							<Fieldset legend="Final Reaction Volume">
								<QuantityField
									valueField="finalVolumeValue"
									unitField="finalVolumeUnit"
									label="Final reaction volume"
									unitOptions={VOLUME_UNITS}
									register={register}
									placeholder="e.g. 20"
								/>
							</Fieldset>
						</Fieldset>
					</div>
					<div className="form__submit">
						<Button className="submit__button" type="submit">
							Calculate
						</Button>
					</div>
				</form>
			</Card>
		</>
	);
};
