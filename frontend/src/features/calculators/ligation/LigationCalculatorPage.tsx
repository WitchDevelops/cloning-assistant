import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { PageTitle } from '@/components/atoms/PageTitle';
import { Card } from '@/components/molecules/Card';
import { Fieldset } from '@/components/molecules/Fieldset';
import { QuantityField } from '@/components/molecules/QuantityField';
import {
	DNA_LENGTH_UNITS,
	DNA_MASS_UNITS,
	MASS_VOLUME_UNITS,
	VOLUME_UNITS,
} from '../utils/units';
import type { LigationFormValues } from './ligationSchema';

export const LigationCalculatorPage = () => {
	const { register } = useForm<LigationFormValues>();
	return (
		<>
			<PageTitle title="Ligation calculator" />
			<Card title="Calculate Volumes for Ligation">
				<form className="calculators__form">
					<div className="form__body">
						<Card title="Vector Data">
							<Fieldset legend="Vector Length">
								<QuantityField
									valueField="vectorLengthValue"
									unitField="vectorLengthUnit"
									label="Vector length"
									unitOptions={DNA_LENGTH_UNITS}
									register={register}
									placeholder="e.g. 3 000"
								/>
							</Fieldset>
							<Fieldset legend="Vector Concentration">
								<QuantityField
									valueField="vectorConcValue"
									unitField="vectorConcUnit"
									label="Vector concentration"
									unitOptions={MASS_VOLUME_UNITS}
									register={register}
									placeholder="e.g. 100"
								/>
							</Fieldset>
							<Fieldset legend="Vector mass">
								<QuantityField
									valueField="vectorMassValue"
									unitField="vectorMassUnit"
									label="Vector mass"
									unitOptions={DNA_MASS_UNITS}
									register={register}
									placeholder="e.g. 50"
								/>
							</Fieldset>
						</Card>
						<Card title="Insert Data">
							<Fieldset legend="Insert Length">
								<QuantityField
									valueField="insertLengthValue"
									unitField="insertLengthUnit"
									label="Insert length"
									unitOptions={DNA_LENGTH_UNITS}
									register={register}
									placeholder="e.g. 1 400"
								/>
							</Fieldset>
							<Fieldset legend="Insert Concentration">
								<QuantityField
									valueField="insertConcValue"
									unitField="insertConcUnit"
									label="Insert concentration"
									unitOptions={MASS_VOLUME_UNITS}
									register={register}
									placeholder="e.g. 20"
								/>
							</Fieldset>
						</Card>
						<Card title="Reaction Parameters">
							<Fieldset legend="Molar Ratio">
								{/* TODO: create a Field input type, with styling and validation */}
								<input type="text" inputMode="decimal"></input>
							</Fieldset>
							<Fieldset legend="Final Volume">
								<QuantityField
									valueField="finalVolumeValue"
									unitField="finalVolumeUnit"
									label="Final reaction volume"
									unitOptions={VOLUME_UNITS}
									register={register}
									placeholder="e.g. 20"
								/>
							</Fieldset>
						</Card>
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
