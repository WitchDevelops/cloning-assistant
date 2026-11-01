import { Card } from '@/components/molecules/Card';
import './Calculators.css';
import { PageTitle } from '@/components/atoms/PageTitle';
import { ROUTES } from '@/routes';

export const Calculators = () => {
	return (
		<>
			<PageTitle title="Calculators" />
			<div className="calculators__container">
				<Card title={'Dilution calculator'} to={ROUTES.dilutionCalculator}>
					<p>
						Calculates required volumes of stock solution and diluent to achieve
						the desired final concentration at a given volume.
					</p>
					<p>
						Uses the c<sub>1</sub>V<sub>1</sub> = c<sub>2</sub>V<sub>2</sub>{' '}
						formula.
					</p>
				</Card>
				<Card title={'Ligation calculator'} to={ROUTES.ligationCalculator}>
					<p>
						Calculates the volumes needed for a single ligation reaction using
						the T4 ligase.
					</p>
				</Card>
			</div>
		</>
	);
};
