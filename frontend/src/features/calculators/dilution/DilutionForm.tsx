import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type DilutionResponse, postDilution } from '../../../api/dilution';
import { Button } from '../../../components/atoms/Button';
import { Fieldset } from '../../../components/molecules/Fieldset';
import { QuantityField } from '../../../components/molecules/QuantityField';
import { formatVolume } from '../utils/formatVolume';
import { roundToPipette } from '../utils/roundToPipette';
import { CONCENTRATION_UNITS, VOLUME_UNITS } from '../utils/units';
import {
	type DilutionFormValues,
	type DilutionInput,
	dilutionInputSchema,
} from './dilutionSchema';
import { toDilutionRequest } from './toDilutionRequest';

export const DilutionForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<DilutionFormValues, unknown, DilutionInput>({
		resolver: zodResolver(dilutionInputSchema),
		mode: 'onTouched',
		reValidateMode: 'onChange',
		defaultValues: {
			stockConcUnit: 'mM',
			finalConcUnit: 'mM',
			finalVolumeUnit: 'µL',
		},
	});

	const [dilutionResult, setDilutionResult] = useState<DilutionResponse | null>(
		null,
	);

	const onSubmit = async (data: DilutionInput) => {
		const request = toDilutionRequest(data);
		const result = await postDilution(request);

		if (result.ok) {
			setDilutionResult(result.data);
		} else {
			console.log(result.message);
		}
	};

	const handleReset = () => {
		reset();
		setDilutionResult(null);
	};

	const toDisplay = (microliters: number) => {
		const rounded = roundToPipette(microliters);
		return { ...formatVolume(rounded.microliters), warning: rounded.warning };
	};

	const stockDisplay = dilutionResult ? toDisplay(dilutionResult.stock) : null;
	const diluentDisplay = dilutionResult
		? toDisplay(dilutionResult.diluent)
		: null;

	return (
		<>
			<form
				className="calculators__form"
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<div className="form__body">
					<Fieldset legend="Stock concentration">
						<QuantityField
							valueField="stockConcValue"
							unitField="stockConcUnit"
							label="Stock concentration"
							unitOptions={CONCENTRATION_UNITS}
							register={register}
							valueError={errors.stockConcValue?.message}
							unitError={errors.stockConcUnit?.message}
							placeholder="e.g. 100"
						/>
					</Fieldset>
					<Fieldset legend="Working concentration">
						<QuantityField
							valueField="finalConcValue"
							unitField="finalConcUnit"
							label="Working concentration"
							unitOptions={CONCENTRATION_UNITS}
							register={register}
							valueError={errors.finalConcValue?.message}
							unitError={errors.finalConcUnit?.message}
							placeholder="e.g. 50"
						/>
					</Fieldset>
					<Fieldset legend="Final volume">
						<QuantityField
							valueField="finalVolumeValue"
							unitField="finalVolumeUnit"
							label="Final volume"
							unitOptions={VOLUME_UNITS}
							register={register}
							valueError={errors.finalVolumeValue?.message}
							unitError={errors.finalVolumeUnit?.message}
							placeholder="e.g. 100"
						/>
					</Fieldset>
				</div>
				<div className="form__submit">
					<Button
						className="submit__button"
						type="submit"
						disabled={isSubmitting}
					>
						{dilutionResult ? 'Recalculate' : 'Calculate'}
					</Button>
					{dilutionResult && (
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
			{stockDisplay && diluentDisplay && (
				<>
					<hr />
					<section aria-live="polite" aria-label="Result">
						<h3 className="result__header">Calculation result</h3>
						<div className="result__wrapper">
							<p>
								<span className="result__label">Stock solution: </span>
								<span>{stockDisplay.value}</span> {stockDisplay.unit}
								{stockDisplay.warning && (
									<span className="result__warning">
										Below reliable pipetting volume - dilute the stock further
										or increase the final volume.
									</span>
								)}
							</p>

							<p>
								<span className="result__label">Diluent: </span>
								<span>{diluentDisplay.value}</span> {diluentDisplay.unit}
								{diluentDisplay.warning && (
									<span className="result__warning">
										Below reliable pipetting volume - dilute the stock further
										or increase the final volume.
									</span>
								)}
							</p>
						</div>
					</section>
				</>
			)}
		</>
	);
};
