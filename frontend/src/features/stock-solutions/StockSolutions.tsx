import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
	getStockSolutions,
	type StockSolution,
} from '../../api/stock-solutions';
import { Card } from '../../components/molecules/Card';
import { Menu } from '../../components/molecules/Menu';
import './StockSolutions.css';
import { toDilutionPrefill } from './toDilutionPrefill';

const SKELETON_IDS = ['skeleton-1', 'skeleton-2', 'skeleton-3'];

type Status =
	| { kind: 'loading' }
	| { kind: 'error'; message: string }
	| { kind: 'success'; stocks: StockSolution[] };

const StockSkeleton = () => (
	<div className="card" aria-hidden="true">
		<div className="skeleton__bar skeleton__bar--title" />
		<div className="stock__row">
			<div className="stock__section stock__box">
				<div className="skeleton__bar skeleton__bar--label" />
				<div className="skeleton__bar" />
				<div className="skeleton__bar" />
			</div>
			<div className="stock__section stock__box">
				<div className="skeleton__bar skeleton__bar--label" />
				<div className="skeleton__bar" />
			</div>
		</div>
		<div className="stock__section">
			<div className="skeleton__bar skeleton__bar--label" />
			<div className="skeleton__bar" />
		</div>
		<div className="stock__section">
			<div className="skeleton__bar skeleton__bar--label" />
			<div className="skeleton__bar" />
		</div>
	</div>
);

export const StockSolutions = () => {
	const [status, setStatus] = useState<Status>({ kind: 'loading' });
	const navigate = useNavigate();

	useEffect(() => {
		getStockSolutions().then((result) => {
			if (result.ok) {
				setStatus({ kind: 'success', stocks: result.data.stocks });
			} else {
				setStatus({ kind: 'error', message: result.message });
			}
		});
	}, []);

	if (status.kind === 'loading') {
		return (
			<div className="stocks__container" aria-busy="true">
				<span className="sr-only" role="status">
					Loading stock solutions…
				</span>
				{SKELETON_IDS.map((id) => (
					<StockSkeleton key={id} />
				))}
			</div>
		);
	}

	if (status.kind === 'error') {
		return (
			<p className="stocks__error" role="alert">
				{status.message}
			</p>
		);
	}

	return (
		<div className="stocks__container">
			{status.stocks.map((stock) => (
				<Card
					key={stock.name}
					title={stock.name}
					actions={
						<Menu
							label={`${stock.name} actions`}
							items={[
								{
									label: 'Dilute',
									onSelect: () => {
										const [firstConcentration] = Object.values(
											stock.composition,
										);

										navigate('/', {
											state: {
												dilutionPrefill: toDilutionPrefill(stock),
												stockName: stock.name,
												stockConcentration: firstConcentration
													? `${firstConcentration.value}${firstConcentration.unit}`
													: undefined,
												stockConcentrationFactor: stock.concentrationFactor,
												stockPh: stock.ph,
											},
										});
									},
								},
							]}
						/>
					}
				>
					<div className="stock__row">
						<div className="stock__section stock__box">
							<h3 className="stock__label">Composition</h3>
							<div className="stock__composition">
								{Object.entries(stock.composition).map(
									([ingredient, concentration]) => (
										<p key={ingredient}>
											{ingredient}, {concentration.value} {concentration.unit}
										</p>
									),
								)}
							</div>
						</div>
						{stock.ph !== null && (
							<div className="stock__section stock__box">
								<h3 className="stock__label">pH</h3>
								<p>{stock.ph.toFixed(1)}</p>
							</div>
						)}
					</div>
					{stock.note !== null && (
						<div className="stock__section">
							<h3 className="stock__label">Note</h3>
							<p>{stock.note}</p>
						</div>
					)}
					{stock.citation !== null && (
						<div className="stock__section">
							<h3 className="stock__label">Citation</h3>
							<a
								className="stock__citation"
								href={stock.citation}
								target="_blank"
								rel="noreferrer"
							>
								{stock.citation}
							</a>
						</div>
					)}
				</Card>
			))}
		</div>
	);
};
