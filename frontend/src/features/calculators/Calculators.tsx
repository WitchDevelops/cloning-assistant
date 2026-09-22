import { DilutionForm } from './dilution/DilutionForm';
import './Calculators.css';

export const Calculators = () => {
	return (
		<div className="calculators__container">
			<div className="calculators__card">
				<h2 className="card__title">Diluting stock</h2>
				<DilutionForm />
			</div>
		</div>
	);
};
