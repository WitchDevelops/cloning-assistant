import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/atoms/Button';
import { Fieldset } from '../../../components/molecules/Fieldset';
import { QuantityField } from '../../../components/molecules/QuantityField';
import { CONCENTRATION_UNITS, VOLUME_UNITS } from '../units';
import {
	type DilutionFormValues,
	type DilutionInput,
	dilutionInputSchema,
} from './dilutionSchema';

export const DilutionForm = () => {
	const {
		register,
		handleSubmit,
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

	const onSubmit = (data: DilutionInput) => {
		// TODO: wire it in #16
		console.log(data);
	};

	return (
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
					/>
				</Fieldset>
			</div>
			<div className="form__submit">
				<Button
					className="submit__button"
					type="submit"
					disabled={isSubmitting}
				>
					Calculate
				</Button>
			</div>
		</form>
	);
};
