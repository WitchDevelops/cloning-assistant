import { Card } from '../../components/molecules/Card';
import { DilutionForm } from './dilution/DilutionForm';
import './Calculators.css';

export const Calculators = () => {
	return (
		<div className="calculators__container">
			<Card title="Diluting stock">
				<DilutionForm />
			</Card>
		</div>
	);
};
