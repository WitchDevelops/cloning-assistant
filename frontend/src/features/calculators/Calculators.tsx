import { useLocation } from 'react-router';
import { Card } from '../../components/molecules/Card';
import { DilutionForm } from './dilution/DilutionForm';
import type { DilutionFormValues } from './dilution/dilutionSchema';
import './Calculators.css';

type CalculatorsLocationState = {
	dilutionPrefill?: Partial<DilutionFormValues>;
	stockName?: string;
	stockConcentration?: string;
	stockConcentationFactor?: number | null;
	stockPh?: number;
};

export const Calculators = () => {
	const location = useLocation();
	const state = location.state as CalculatorsLocationState | null;

	const concentrationLabel = state?.stockConcentationFactor
		? ''
		: `${state?.stockConcentration}`;
	const phLabel = state?.stockPh != null ? `, pH = ${state.stockPh}` : '';
	const stockLabel = state?.stockName
		? `Diluting ${concentrationLabel} ${state.stockName}${phLabel}`
		: 'Diluting stock';
	return (
		<div className="calculators__container">
			<Card title={stockLabel}>
				<DilutionForm prefill={state?.dilutionPrefill} />
			</Card>
		</div>
	);
};
