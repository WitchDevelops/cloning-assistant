import { useForm } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { PageTitle } from '@/components/atoms/PageTitle';
import { Card } from '@/components/molecules/Card';
import { Fieldset } from '@/components/molecules/Fieldset';
import { QuantityField } from '@/components/molecules/QuantityField';
import { RatioField } from '@/components/molecules/RatioField';
import {
	DEFAULT_MOLAR_RATIO,
	type LigationFormValues,
	type LigationInput,
	ligationInputSchema,
	MOLAR_RATIO_PRESETS,
} from '@/features/calculators/ligation/ligationSchema';
import {
	DNA_LENGTH_UNITS,
	DNA_MASS_UNITS,
	MASS_VOLUME_UNITS,
	VOLUME_UNITS,
} from '@/features/calculators/utils/units';
import '@/features/calculators/ligation/LigationCalculatorPage.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { type LigationResponse, postLigation } from '@/api/ligation';
import { toLigationRequest } from './toLigationRequest';

export const LigationCalculatorPage = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<LigationFormValues, unknown, LigationInput>({
		resolver: zodResolver(ligationInputSchema),
		mode: 'onTouched',
		reValidateMode: 'onChange',
		defaultValues: {
			molarRatio: DEFAULT_MOLAR_RATIO,
		},
	});

	const [ligationResult, setLigationResult] = useState<LigationResponse | null>(
		null,
	);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const onSubmit = async (data: LigationInput) => {
		const request = toLigationRequest(data);
		const result = await postLigation(request);

		if (result.ok) {
			console.log(result.data);
			setLigationResult(result.data);
		} else {
			setSubmitError(result.message);
		}
	};

	const handleReset = () => {
		reset();
		setLigationResult(null);
		setSubmitError(null);
	};

	return (
		<>
			<PageTitle title="Ligation calculator" />
			<div className="ligation-calculator__container">
				<Card title="Calculate Volumes for Ligation">
					<form
						className="calculators__form"
						onSubmit={handleSubmit(onSubmit)}
						noValidate
					>
						<div className="form__body">
							<Fieldset legend="Vector Data" variant="outlined-group">
								<Fieldset legend="Length">
									<QuantityField
										valueField="vectorLengthValue"
										unitField="vectorLengthUnit"
										label="Vector length"
										unitOptions={DNA_LENGTH_UNITS}
										register={register}
										valueError={errors.vectorLengthValue?.message}
										unitError={errors.vectorLengthUnit?.message}
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
										valueError={errors.vectorConcValue?.message}
										unitError={errors.vectorConcUnit?.message}
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
										valueError={errors.vectorMassValue?.message}
										unitError={errors.vectorMassUnit?.message}
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
										valueError={errors.insertLengthValue?.message}
										unitError={errors.insertLengthUnit?.message}
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
										valueError={errors.insertConcValue?.message}
										unitError={errors.insertConcUnit?.message}
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
										error={errors.molarRatio?.message}
									/>
								</Fieldset>
								<Fieldset legend="Final Reaction Volume">
									<QuantityField
										valueField="finalVolumeValue"
										unitField="finalVolumeUnit"
										label="Final reaction volume"
										unitOptions={VOLUME_UNITS}
										register={register}
										valueError={errors.finalVolumeValue?.message}
										unitError={errors.finalVolumeUnit?.message}
										placeholder="e.g. 20"
									/>
								</Fieldset>
							</Fieldset>
						</div>
						{submitError ? (
							<p role="alert" className="form__error">
								<i>Error:</i> {submitError}
							</p>
						) : (
							''
						)}
						<div className="form__submit">
							<Button
								className="submit__button"
								type="submit"
								disabled={isSubmitting}
							>
								{ligationResult ? 'Recalculate' : 'Calculate'}
							</Button>
							{ligationResult && (
								<Button
									className="reset__button"
									type="button"
									variant="secondary"
									onClick={handleReset}
								>
									Reset
								</Button>
							)}
						</div>
					</form>
				</Card>
			</div>
		</>
	);
};
