import { useLocation } from 'react-router';
import { PageTitle } from '@/components/atoms/PageTitle';
import { Card } from '@/components/molecules/Card';
import { DilutionForm } from './DilutionForm';
import type { DilutionFormValues } from './dilutionSchema';

type DilutionLocationState = {
	dilutionPrefill?: Partial<DilutionFormValues>;
	stockName?: string;
	stockConcentration?: string;
	stockConcentrationFactor?: number | null;
	stockPh?: number;
};

export const DilutionCalculatorPage = () => {
	const location = useLocation();
	const state = location.state as DilutionLocationState | null;

	const concentrationLabel = state?.stockConcentrationFactor
		? ''
		: `${state?.stockConcentration}`;
	const phLabel = state?.stockPh != null ? `, pH = ${state.stockPh}` : '';
	const stockLabel = state?.stockName
		? `Diluting ${concentrationLabel}${state.stockName}${phLabel}`
		: 'Diluting stock';
	return (
		<>
			<PageTitle title="Dilution calculator" />
			<div className="calculators__container">
				<Card title={stockLabel}>
					<DilutionForm prefill={state?.dilutionPrefill} />
				</Card>
			</div>
		</>
	);
};
